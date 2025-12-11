import { Search } from "lucide-react"
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../shared/ui"
import { useTags } from "../../entities/tag"
import { useQueryParams } from "../../shared/hooks"

export const PostFilters = () => {
  const { data: tags = [] } = useTags()
  const { searchQuery, selectedTag, sortBy, sortOrder, updateURL, setParams } = useQueryParams()

  const handleSearchSubmit = (query: string) => {
    setParams((prev) => ({ ...prev, searchQuery: query, skip: 0 }))
    updateURL({ searchQuery: query, skip: 0 })
  }

  const handleTagChange = (tag: string) => {
    setParams((prev) => ({ ...prev, selectedTag: tag, skip: 0 }))
    updateURL({ selectedTag: tag, skip: 0 })
  }

  const handleSortByChange = (newSortBy: string) => {
    setParams((prev) => ({ ...prev, sortBy: newSortBy }))
    updateURL({ sortBy: newSortBy })
  }

  const handleSortOrderChange = (newSortOrder: string) => {
    setParams((prev) => ({ ...prev, sortOrder: newSortOrder }))
    updateURL({ sortOrder: newSortOrder })
  }

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
                handleSearchSubmit(value)
              }
            }}
          />
        </div>
      </div>
      <Select value={selectedTag} onValueChange={handleTagChange}>
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
      <Select value={sortBy} onValueChange={handleSortByChange}>
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
      <Select value={sortOrder} onValueChange={handleSortOrderChange}>
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
