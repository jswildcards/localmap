interface MatchedSubstring {
  length: number
  offset: number
}

interface StructuredFormatting {
  main_text: string
  main_text_matched_substrings: MatchedSubstring[]
}

interface Term {
  offset: number
  value: string
}

interface Prediction {
  description: string
  matched_substrings: MatchedSubstring[]
  place_id: string
  reference: string
  structured_formatting: StructuredFormatting
  terms: Term[]
  types: string[]
}

type AutocompleteResponse = Prediction[]

export type {
  AutocompleteResponse,
}
