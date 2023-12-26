"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import axios from 'axios';
import { NextForm } from "./NextForm"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
  
const FormSchema = z.object({
    text: z
    .string()
    .min(1, {
      message: "text must be at least 1 characters.",
    }),
    model: z
    .string({
      required_error: "choose a valid model.",
    })
    .min(1, {
        message: "choose a model.",
        }),

})


export function TextareaForm() {
    
    const [textBox1Value, setTextBox1Value] = useState('');
    const [textBox2Value, setTextBox2Value] = useState('');
    const [showNextForm, setNextForm] = useState<boolean>(false);
    const [dataText, setDataText] = useState<string>('');
    const [dataModel, setDataModel] = useState<string>('');

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      // Make a POST request to your server endpoint
      const response = await axios.post('https://https://ml-backend-fhof.onrender.com/api/text-submit', data);

      const decision = response.data.output.decision;
      const confidence = response.data.output.confidence;
      
      setDataText(data.text);
      setDataModel(data.model);
      setTextBox1Value(decision);
      setTextBox2Value(confidence);
      setNextForm(true);

      // Handle the response as needed
      console.log('Server response:', response.data);

    } catch (error) {
      // Handle errors, e.g., show an error message
      console.error('Error submitting form:', error);
    }
  }

  return (
    <> 
    <div className="flex justify-around flex-col md:flex-row">
        <div className="basis-1/2">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} >
                <FormField 
                control={form.control}
                name="text"
                render={({ field }) => (
                    <FormItem className="text-left	">
                    <FormLabel className="ml-7">Text</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="Enter input text"
                        className="resize-none min-h-[200px] p-4 "
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                    <FormItem className=" text-left px-0 py-4 ">
                    <FormLabel className="ml-7">Model</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} >
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a model" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent >
                        <SelectItem value="Model A">Model A</SelectItem>
                        <SelectItem value="Model B">Model B</SelectItem>
                        <SelectItem value="Model C">Model C</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormDescription className="text-center">
                        Enter the text and select a model.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <div className="p-4 ">
                <Button type="submit">Submit</Button>
                </div>
            </form>
            </Form>
        </div>
        <div className="flex justify-center flex-col">
            <div className="items-center gap-1.5">
            <Label htmlFor="text">H/AI</Label>
            <Input type="text" id="email" placeholder="Human / AI" 
                value={textBox1Value}
                readOnly
                onChange={(e) => setTextBox1Value(e.target.value)}/>
            </div>
            <div className="items-center gap-1.5 md:pb-48 pt-10">
            <Label htmlFor="text">Confindece</Label>
            <Input type="text" id="email" placeholder="Confidence" 
                value={textBox2Value}
                readOnly
                onChange={(e) => setTextBox2Value(e.target.value)}/>
            </div>
        </div>
    </div>
    {showNextForm && <NextForm usertext = {dataText} usermodel={dataModel} decision={textBox1Value} confidence={textBox2Value} />}
    </>
  )
}
