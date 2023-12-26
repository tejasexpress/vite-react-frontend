import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface ChildProps {
    explanation: string;
  }
 
export function Explanation({explanation}: ChildProps) {
  return (
  <div className="grid w-full gap-1.5 mt-10">
    <Label htmlFor="message" className="text-lg text-left ml-5">Explanation</Label>
    <Textarea className=" resize-none min-h-[200px] p-4" placeholder="Explanation Loading"  value={explanation} readOnly/>
    </div>
    )
}
