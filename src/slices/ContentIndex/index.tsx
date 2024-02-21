import Bounded from "@/components/bounded";
import Heading from "@/components/heading";
import { Content, isFilled } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import ContentList from "./contentlist";
import { createClient } from "@/prismicio";

/**
 * Props for `ContentIndex`.
 */
export type ContentIndexProps = SliceComponentProps<Content.ContentIndexSlice>;

/**
 * Component for "ContentIndex" Slices.
 */
const ContentIndex = async ({ slice }: ContentIndexProps): Promise<JSX.Element> => {

  const client = createClient()

  const blog_posts = await client.getAllByType("blog_post")
  const projects = await client.getAllByType("project")

  const content_type = slice.primary.content_type || "Blog"

  const items = content_type === "Blog" ? blog_posts : projects

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}>
      <Heading size="xl" className="mb-8">
        {slice.primary.heading}
      </Heading>
      {isFilled.richText(slice.primary.description) && (
        <div className="prose prose-xl prose-invert mb-10">
          <PrismicRichText field={slice.primary.description} />
        </div>
      )}
      <ContentList items={items} contentType={content_type} viewMoreText={slice.primary.view_more_text} fallbackItemImage={slice.primary.fallback_item_image}/>
    </Bounded>
  );
};

export default ContentIndex;
