/*
  WHY a queryKeys file?
  
  Without it:
    useQuery({ queryKey: ['projects'] })          ← in ProjectsPage
    useQueryClient().invalidateQueries(['projet']) ← typo! bug! 😱
  
  With it:
    useQuery({ queryKey: queryKeys.projects.all })
    useQueryClient().invalidateQueries(queryKeys.projects.all)
    TypeScript catches typos for you ✅
    
  This is a best practice used in production apps.
*/

export const queryKeys = {
  projects: {
    all:      ['projects']                    as const,
    featured: ['projects', 'featured']        as const,
    detail:   (id: string) => ['projects', id] as const,
  },

  blog: {
    all:    ['blog']                          as const,
    detail: (slug: string) => ['blog', slug]  as const,
  },

  contact: {
    all: ['contact'] as const,
  },
}
