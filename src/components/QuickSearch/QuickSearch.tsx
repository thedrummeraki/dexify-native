import React from 'react';
import {useState} from 'react';
import SearchBar from '../SearchBar';
import MangaCollection from '../MangaCollection';

export function QuickSearch() {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <>
      <SearchBar
        loading={loading}
        query={title}
        placeholder="Quick search..."
        onQueryChange={setTitle}
      />
      <MangaCollection
        onLoading={setLoading}
        params={{title, limit: 10, order: {followedCount: 'desc'}}}
      />
    </>
  );
}
