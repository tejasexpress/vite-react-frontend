"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import axios from 'axios';
import { useState } from "react"
import { Explanation } from "./Explanation"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"


const FormSchema = z.object({
  mobile: z.boolean().default(false).optional(),
  expmodel: z
    .string({
      required_error: "choose a valid model.",
    })
    .min(1, {
        message: "choose a model.",
        }),
})

interface NextFormProps {
    usertext: string;
    usermodel: string;
    decision: string;
    confidence: string;
  }

export function NextForm({ usertext, usermodel, decision, confidence }: NextFormProps) {

  const [showModel, setShowModel] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [explanation, setExplanation] = useState<string>('');

  const handleShowModel = () => {
    setShowModel(!showModel);
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      mobile: false,
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
        // Make a POST request to your server endpoint
        let expInput = {
            usertext: usertext,
            usermodel: usermodel,
            decision: decision,
            confidence: confidence,
            expmodel: data.expmodel,
        }
        const response = await axios.post('http://https://ml-backend-fhof.onrender.com/api/explanation-submit', expInput);

        // Handle the response as needed
        
        setExplanation(JSON.stringify(response.data.output,null,2));
        setShowExplanation(true);
        console.log('Server response:', response.data);
        const scrollToBottom = () => {
            window.scrollTo({
              top: document.documentElement.scrollHeight,
              behavior: 'smooth',
            })};
        setTimeout(scrollToBottom, 500);
  
      } catch (error) {
        // Handle errors, e.g., show an error message
        console.error('Error submitting form:', error);
      }
  }

  return (
    <>
    <div className=" mx-auto">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4 ">
        <div className="flex items-center">
            <div className="basis-1/2 items-center items-center">
            <FormField
            control={form.control}
            name="mobile"
            render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow mx-5 text-left">
                <FormControl>
                    <Checkbox
                    defaultChecked={false}
                    onCheckedChange={(checked) => {field.onChange(checked); handleShowModel()}}
                    />
                </FormControl>
                <div className="space-y-1 leading-none">
                    <FormLabel>
                    Do you want an explanation?
                    </FormLabel>
                    <FormDescription>
                    Check if yes and select an explanation model
                    </FormDescription>
                </div>
                </FormItem>
            )}
            />
            </div>
            <div className="basis-1/2 mx-5">
            {showModel && 
            <FormField
                    control={form.control}
                    name="expmodel"
                    render={({ field }) => (
                        <FormItem className=" text-left px-0 py-4 ">
                        <FormLabel className="ml-7">Explanation Model</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} >
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a model" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent >
                            <SelectItem value="Explanation Model 1">Explanation Model 1</SelectItem>
                            <SelectItem value="Explanation Model 2">Explanation Model 2</SelectItem>
                            <SelectItem value="Explanation Model 3">Explanation Model 3</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormDescription className="text-center">
                            Select and explanation model.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />}
                    </div>
                </div>
        {showModel && <Button type="submit">Submit</Button>}
      </form>
    </Form>
    </div>
    {showExplanation && <Explanation explanation={explanation} />}
    </>
  )
}
