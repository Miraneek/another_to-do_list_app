"use client"
import React from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Dialog from '@radix-ui/react-dialog'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {IconCheck, IconDots} from "@tabler/icons-react";
import {ToDoEdit} from "@/modules/to-dos/To-doEdit";
import {completeToDo, deleteToDo, unCompleteToDo} from "@/utils/to-do's/to-doFunctions";
import {Loading} from "@/modules/utils/Loading/Loading";
import {TodoCloseView} from "@/modules/to-dos/TodoCloseView/TodoCloseView";

interface ToDo {
    data: {
        title: string;
        description: string;
        priority: string;
        isPublic: boolean;
        isDone: boolean;
        deadline?: Date;
    },
    id: string,
    onDelete: (id: string) => void
}

export function ToDoCard({data, id, onDelete}: ToDo) {

    const [openCloseView, setOpenCloseView] = React.useState(false);
    const [openEdit, setOpenEdit] = React.useState(false);
    const [isCompleting, setIsCompleting] = React.useState(false);
    const [isDone, setIsDone] = React.useState(data.isDone)

    const priorityColors: { [key: string]: string } = {
        low: 'bg-green-500',
        medium: 'bg-yellow-500',
        high: 'bg-red-500',
    };

    const handleCheck = () => {
        setIsCompleting(true)
        if (isDone) {
            unCompleteToDo(id).then(() => {
                setIsCompleting(false)
                setIsDone(false)
            })
        } else {
            completeToDo(id).then(() => {
                setIsCompleting(false)
                setIsDone(true)
            })
        }
    }

    const handleDelete = () => {
        deleteToDo(id).then(() => {
            onDelete(id)
        })
    }

    return (
        <div
            className={(isDone ? "bg-green-900 order-10" : (data.priority === "high" ? "order-1" : data.priority === "medium" ? "order-2" : "order-3")) + " w-full rounded-lg shadow-lg"}>
            <div className="flex items-center justify-between p-4 text-white w-full">
                <div className={"flex items-center gap-3"}>
                    {isCompleting ? <Loading/> : (
                        <Checkbox.Root
                            className="flex border-2 border-[#4F5461] h-[26px] w-[26px] appearance-none items-center justify-center rounded-lg outline-none"
                            onCheckedChange={handleCheck}
                            defaultChecked={isDone}
                        >
                            <Checkbox.Indicator>
                                <IconCheck stroke={2} color={"#858da2"}/>
                            </Checkbox.Indicator>
                        </Checkbox.Root>
                    )}
                    <div>
                        <div className={"text-lg font-semibold"}>{data.title}</div>
                        {data.deadline && (
                            <div
                                className="text-sm text-gray-400">Due: {new Date(data.deadline).toLocaleDateString()}</div>
                        )}
                    </div>
                </div>
                <div className={"flex items-center gap-2"}>
                    <div className={`rounded-full text-xs py-0.5 px-1.5 ${priorityColors[data.priority]}`}>
                        {data.priority}
                    </div>
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <button
                                className="w-[25px] h-[25px] inline-flex items-center justify-center outline-none"
                                aria-label="Customise options"
                            >
                                <IconDots size={18}/>
                            </button>
                        </DropdownMenu.Trigger>

                        <DropdownMenu.Portal>
                            <DropdownMenu.Content
                                className="bg-white rounded-md outline-none overflow-hidden"
                                sideOffset={5}>
                                <DropdownMenu.Item
                                    className="flex text-sm outline-none hover:bg-gray-100 items-center gap-2 py-1 px-2 text-black">
                                    <button onClick={() => setOpenCloseView(true)}>View</button>
                                </DropdownMenu.Item>
                                <DropdownMenu.Item
                                    className="flex text-sm outline-none hover:bg-gray-100 items-center gap-2 py-1 px-2 text-black">
                                    <button onClick={() => setOpenEdit(true)}>
                                        Edit
                                    </button>
                                </DropdownMenu.Item>
                                <DropdownMenu.Item
                                    className="flex text-sm outline-none hover:bg-red-100 items-center gap-2 py-1 px-2 bg-red-50 text-red-900">
                                    <button onClick={handleDelete}>
                                        Delete
                                    </button>
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                </div>

            </div>
            <Dialog.Root open={openEdit} onOpenChange={setOpenEdit}>
                <Dialog.Portal>
                    <Dialog.Overlay
                        className="bg-[rgba(0,0,0,0.5)] top-0 left-0 right-0 bottom-0 fixed grid place-content-center text-black">
                        <Dialog.Content
                            className="fixed top-[50%] left-[50%] translate-x-[-50%] lg:w-auto lg:min-w-[400px] w-[90vw] translate-y-[-50%] rounded-xl focus:outline-none">
                            <ToDoEdit data={data} id={id} setOpen={setOpenEdit}/>
                        </Dialog.Content>
                    </Dialog.Overlay>

                </Dialog.Portal>
            </Dialog.Root>
            <Dialog.Root open={openCloseView} onOpenChange={setOpenCloseView}>
                <Dialog.Portal>
                    <Dialog.Overlay
                        className="bg-[rgba(0,0,0,0.5)] top-0 left-0 right-0 bottom-0 fixed grid place-content-center text-black">
                        <Dialog.Content
                            className="fixed top-[50%] left-[50%] translate-x-[-50%] lg:w-auto lg:min-w-[400px] w-[90vw] translate-y-[-50%] rounded-xl focus:outline-none">
                            <TodoCloseView todo={data} setOpenCloseView={setOpenCloseView}/>
                        </Dialog.Content>
                    </Dialog.Overlay>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    )
}
