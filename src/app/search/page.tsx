'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function SearchPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || '';
    const [query, setQuery] = useState(initialQuery);
    console.log(query)

    function handleSearch() {

        const params = new URLSearchParams();
        params.set('q', query);
        console.log(params.toString())
        router.push(`/search?${params.toString()}`);
    }

    return (
        <>
            <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search..."
            />
            <button onClick={handleSearch}>Search</button>
            <p>Search term from URL: {initialQuery}</p>
        </>
    );
}
