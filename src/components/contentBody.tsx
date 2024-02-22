import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import Bounded from "@/components/bounded";
import Heading from "@/components/heading";
import { Content, DateField, isFilled } from "@prismicio/client";


export default function ContentBody({page}: {
    page: Content.BlogPostDocument | Content.ProjectDocument
}) {
  function formatDate(date: DateField){
    if(isFilled.date(date)){
      return new Intl.DateTimeFormat('en-IN',{ dateStyle: 'full'}).format(new Date(date))
    }
  }
    
  return (
    <Bounded as="article">
      <div className="rounded-xl border-2 border-slate-800 bg-slate-900 px-4 py-10 md:px-8 md:py-20">
        <Heading as="h1">{page.data.title}</Heading>
        <div className="flex gap-4 text-yellow-500 text-xl font-bold mt-4">
          {page.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
        <p className="mt-8 border-b border-slate-700 text-xl font-medium text-slate-300">
          {formatDate(page.data.date)}
        </p>
        <div className="prose prose-lg prose-invert mt-12 w-full max-w-none md:mt-20 ">
          <SliceZone slices={page.data.slices} components={components} />
        </div>
      </div>
    </Bounded>
  )
}
