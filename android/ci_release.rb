#!/usr/bin/env ruby
# frozen_string_literal: true

require 'rest-client'
require 'json'

class GitLabRelease
  def initialize
    @api_url = ENV.fetch('CI_API_V4_URL')
    @project_id = ENV.fetch('CI_PROJECT_ID')
    @project_url = ENV.fetch('CI_PROJECT_URL')
    @job_token = ENV.fetch('CI_JOB_TOKEN')
    @commit_sha = ENV.fetch('CI_COMMIT_SHA')
    @commit_short_sha = ENV.fetch('CI_COMMIT_SHORT_SHA')
    @pipeline_id = ENV.fetch('CI_PIPELINE_ID')
  end

  def run
    version = extract_version
    tag = "v#{version}-#{@commit_short_sha}"

    puts "Creating release #{tag}..."
    create_release(tag)

    assets = find_assets
    assets.each { |path| upload_asset(tag, path) }

    puts "Release #{tag} created successfully!"
    puts "#{@project_url}/-/releases/#{tag}"
  end

  private

  def headers
    { 'JOB-TOKEN' => @job_token }
  end

  def extract_version
    gradle_file = File.read('app/build.gradle')
    match = gradle_file.match(/versionName\s+["']([^"']+)["']/)
    raise 'Could not extract versionName from build.gradle' unless match

    match[1]
  end

  def find_assets
    patterns = %w[
      app/build/outputs/apk/release/*.apk
      app/build/outputs/bundle/release/*.aab
    ]

    patterns.flat_map { |p| Dir.glob(p) }.tap do |files|
      raise 'No release artifacts found' if files.empty?
    end
  end

  def create_release(tag)
    url = "#{@api_url}/projects/#{@project_id}/releases"

    payload = {
      tag_name: tag,
      ref: @commit_sha,
      name: "Release #{tag}",
      description: "Automated release from pipeline #{@pipeline_id}"
    }

    RestClient.post(url, payload.to_json, headers.merge(content_type: :json))
    puts "  Created release: #{tag}"
  rescue RestClient::ExceptionWithResponse => e
    raise "Failed to create release: #{e.response&.body || e.message}"
  end

  def upload_asset(tag, file_path)
    filename = File.basename(file_path)
    puts "  Uploading #{filename}..."

    upload_url = upload_file(file_path)
    link_asset(tag, filename, upload_url)

    puts "  Linked #{filename} to release"
  end

  def upload_file(file_path)
    url = "#{@api_url}/projects/#{@project_id}/uploads"
    file = File.new(file_path, 'rb')

    response = RestClient.post(url, { file: file }, headers)
    json = JSON.parse(response.body)

    "#{@project_url}#{json.fetch('url')}"
  rescue RestClient::ExceptionWithResponse => e
    raise "Failed to upload file: #{e.response&.body || e.message}"
  ensure
    file&.close
  end

  def link_asset(tag, filename, asset_url)
    url = "#{@api_url}/projects/#{@project_id}/releases/#{tag}/assets/links"

    payload = {
      name: filename,
      url: asset_url,
      link_type: filename.end_with?('.aab') ? 'package' : 'other'
    }

    RestClient.post(url, payload.to_json, headers.merge(content_type: :json))
  rescue RestClient::ExceptionWithResponse => e
    raise "Failed to link asset: #{e.response&.body || e.message}"
  end
end

GitLabRelease.new.run
