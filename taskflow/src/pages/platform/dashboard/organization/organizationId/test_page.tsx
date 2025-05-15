import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useApiRequest } from '@/action/auth';
import { Board } from './board';
import { z } from 'zod';

const OrganizationIdPag = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [boards, setBoards] = useState([]);
  const { apiRequest } = useApiRequest();

  const schema = z.object({
    title: z.string().min(3, {
      message: 'Minimum length of 3 letters is required',
    }),
  });

  const fetchBoards = async () => {
    try {
      const data = await apiRequest('/api/boards/', null, 'GET');
      setBoards(data);
    } catch (error: any) {
      console.error('Failed to fetch boards:', error.message);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await apiRequest(`/api/boards/${id}/`, null, 'DELETE');
      setMessage('Board deleted successfully!');
      fetchBoards();
    } catch (error: any) {
      setMessage(error.message || 'An error occurred during deletion');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = schema.safeParse({ title });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setMessage(fieldErrors.title?.[0] || 'Missing fields');
      return;
    }

    try {
      await apiRequest('/api/boards/', { title }, 'POST');
      setMessage('Board created successfully!');
      setTitle('');
      fetchBoards();
    } catch (error: any) {
      setMessage(error.message || 'An error occurred');
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={title}
          required
          placeholder="Enter a board title"
          onChange={(e) => setTitle(e.target.value)}
          className="border-black border p-1"
        />
        <Button type="submit">Submit</Button>
      </form>

      {message && <p className="text-rose-500 ">{message}</p>}

      <div className="mt-4 space-y-2">
        <h2 className="text-lg font-bold">Boards:</h2>
        {boards.map((board: any) => (
          <Board
            key={board.id}
            id={board.id}
            title={board.title}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default OrganizationIdPag;
