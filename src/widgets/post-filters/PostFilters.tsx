import { Search } from "lucide-react"
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../shared/ui"
import type { Tag } from "../../entities/tag"

interface PostFiltersProps {
  searchQuery: string
  selectedTag: string
  sortBy: string
  sortOrder: string
  tags: Tag[]
  onSearchSubmit: (query: string) => void
  onTagChange: (value: string) => void
  onSortByChange: (value: string) => void
  onSortOrderChange: (value: string) => void
}

export const PostFilters = ({
  searchQuery,
  selectedTag,
  sortBy,
  sortOrder,
  tags,
  onSearchSubmit,
  onTagChange,
  onSortByChange,
  onSortOrderChange,
}: PostFiltersProps) => {
  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            key={searchQuery}
            placeholder="게시물 검색..."
            className="pl-8"
            defaultValue={searchQuery}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                const value = (e.target as HTMLInputElement).value
                onSearchSubmit(value)
              }
            }}
          />
        </div>
      </div>
      <Select value={selectedTag} onValueChange={onTagChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="태그 선택" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">모든 태그</SelectItem>
          {tags.map((tag) => (
            <SelectItem key={tag.url} value={tag.slug}>
              {tag.slug}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={sortBy} onValueChange={onSortByChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="정렬 기준" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">없음</SelectItem>
          <SelectItem value="id">ID</SelectItem>
          <SelectItem value="title">제목</SelectItem>
          <SelectItem value="reactions">반응</SelectItem>
        </SelectContent>
      </Select>
      <Select value={sortOrder} onValueChange={onSortOrderChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="정렬 순서" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">오름차순</SelectItem>
          <SelectItem value="desc">내림차순</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
