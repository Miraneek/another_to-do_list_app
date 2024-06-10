"use client"
import { useEffect, useState } from 'react';
import { ToDoCard } from "@/modules/to-dos/To-doCard";
import { getAllToDos} from "@/utils/to-do's/to-doFunctions";
import {Loading} from "@/modules/utils/Loading/Loading";

interface ToDo {
    id: string;
    data: any; // Replace 'any' with the actual type of your data
}

export function ToDos() {
    const [todos, setTodos] = useState<ToDo[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);


    useEffect(() => {
        async function fetchTodos() {
            try {
                const result = await getAllToDos();
                setTodos(result);
                setLoading(false)
            } catch (error: any) {
                setError(error.message);
            }
        }
        fetchTodos();
    }, []);

    if (loading) {
        return <Loading/>;
    }

    if (error) {
        return <div className={"text-red-700"}>Error: {error}</div>;
    }

    return (
        <div className={"flex flex-col items-stretch w-11/12 lg:w-3/4 gap-2"}>
            {todos.map((card) => (
                <ToDoCard key={card.id} data={card.data} id={card.id} />
            ))}
            {error && <div className={"text-red-700 text-4xl"}>{error}</div>}
        </div>
    );
}
