import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

export interface QueryParams {
  skip: number
  limit: number
  searchQuery: string
  sortBy: string
  sortOrder: string
  selectedTag: string
}

export const useQueryParams = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const getParamsFromURL = (): QueryParams => {
    const params = new URLSearchParams(location.search)
    return {
      skip: parseInt(params.get("skip") || "0"),
      limit: parseInt(params.get("limit") || "10"),
      searchQuery: params.get("search") || "",
      sortBy: params.get("sortBy") || "",
      sortOrder: params.get("sortOrder") || "asc",
      selectedTag: params.get("tag") || "",
    }
  }

  const [params, setParams] = useState<QueryParams>(getParamsFromURL())

  const updateURL = (newParams: Partial<QueryParams>) => {
    const urlParams = new URLSearchParams()
    const merged = { ...params, ...newParams }

    if (merged.skip) urlParams.set("skip", merged.skip.toString())
    if (merged.limit) urlParams.set("limit", merged.limit.toString())
    if (merged.searchQuery) urlParams.set("search", merged.searchQuery)
    if (merged.sortBy) urlParams.set("sortBy", merged.sortBy)
    if (merged.sortOrder) urlParams.set("sortOrder", merged.sortOrder)
    if (merged.selectedTag) urlParams.set("tag", merged.selectedTag)

    navigate(`?${urlParams.toString()}`)
  }

  useEffect(() => {
    setParams(getParamsFromURL())
  }, [location.search])

  return {
    ...params,
    updateURL,
    setParams,
  }
}
