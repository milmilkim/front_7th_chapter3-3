import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../shared/ui"
import { useQueryParams } from "../../shared/hooks"

interface PaginationProps {
  total: number
}

export const Pagination = ({ total }: PaginationProps) => {
  const { skip, limit, updateURL, setParams } = useQueryParams()

  const handleLimitChange = (newLimit: number) => {
    setParams((prev) => ({ ...prev, limit: newLimit, skip: 0 }))
    updateURL({ limit: newLimit, skip: 0 })
  }

  const handlePrevious = () => {
    const newSkip = Math.max(0, skip - limit)
    setParams((prev) => ({ ...prev, skip: newSkip }))
    updateURL({ skip: newSkip })
  }

  const handleNext = () => {
    const newSkip = skip + limit
    setParams((prev) => ({ ...prev, skip: newSkip }))
    updateURL({ skip: newSkip })
  }

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span>표시</span>
        <Select value={limit.toString()} onValueChange={(value) => handleLimitChange(Number(value))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="30">30</SelectItem>
          </SelectContent>
        </Select>
        <span>항목</span>
      </div>
      <div className="flex gap-2">
        <Button disabled={skip === 0} onClick={handlePrevious}>
          이전
        </Button>
        <Button disabled={skip + limit >= total} onClick={handleNext}>
          다음
        </Button>
      </div>
    </div>
  )
}
