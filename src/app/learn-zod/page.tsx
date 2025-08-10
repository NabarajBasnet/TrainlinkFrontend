'use client';

import React from "react";
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
    name: z.string().min(5),
    email: z.string().email('Invalid email').min(20, 'Must be 10 characters')
})

type FormSchameType = z.infer<typeof formSchema>

export default function LearnZod() {

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<FormSchameType>({
        resolver: zodResolver(formSchema
        )
    })

    const submitData = async (data: FormSchameType) => {
        console.log(data);
    }

    return (
        <div className="w-full min-h-screen">
            <form onSubmit={handleSubmit(submitData)}>
                <label htmlFor="name">Name</label>
                <input
                    id="name"
                    {...register('name')}
                    type="text"
                    placeholder="Enter your name"
                />

                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    {...register('email')}
                    type="email"
                    placeholder="Enter your email"
                />
                {errors.email && (
                    <p>{`${errors.email.message}`}</p>
                )}

                <button type="submit">Submit</button>
            </form>
        </div>
    )
}
