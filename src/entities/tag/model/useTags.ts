import { useQuery } from "@tanstack/react-query"
import { tagApi } from "../api"

export const useTags = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      return await tagApi.fetchTags()
    },
  })
}
