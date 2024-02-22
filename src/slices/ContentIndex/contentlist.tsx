"use client"

import { Content, asImageSrc, isFilled } from '@prismicio/client'
import Link from 'next/link'
import React, { useEffect, useRef } from 'react'
import { MdArrowOutward } from 'react-icons/md'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'


gsap.registerPlugin(ScrollTrigger)

type ContentListProps = {
  items: Content.BlogPostDocument[] | Content.ProjectDocument[]
  contentType: Content.ContentIndexSlice["primary"]["content_type"]
  fallbackItemImage: Content.ContentIndexSlice["primary"]["fallback_item_image"]
  viewMoreText: Content.ContentIndexSlice["primary"]["view_more_text"]
}

export default function ContentList({items, contentType, fallbackItemImage, viewMoreText = "Read More"}: ContentListProps) {

  const component = useRef(null)
  const revealRef = useRef(null)
  const itemsRef = useRef<Array<HTMLLIElement | null>>([])

  const [currentItem, setCurrentItem] = React.useState<null | number>(null)

  const urlPrefixes = contentType === "Blog" ? "/blog" : "/projects"

  const lastMousePos = useRef({x: 0, y: 0})

  useEffect(() => {
    let ctx = gsap.context(() => {
      itemsRef.current.forEach((item) => {
        gsap.fromTo(item, {opacity: 0, y: 20}, {opacity: 1, y: 0, duration: 1, ease: "elastic.out(1, 0.25)", stagger: 0.25, scrollTrigger: {trigger: item, start: "top bottom-=150px", end: "bottom center", toggleActions: "play none none none"}})
      })
      return () => ctx.revert()
    }, component)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const mousePos = {
        x: e.clientX,
        y: e.clientY + window.scrollY
      }

      const speed = Math.sqrt(Math.pow(mousePos.x - lastMousePos.current.x, 2))

      let ctx = gsap.context(() => {
        if(currentItem !== null){
          const maxY = window.scrollY + window.innerHeight - 250
          const maxX = window.innerWidth - 350

          gsap.to(revealRef.current, {
            x: gsap.utils.clamp(0, maxX, mousePos.x - 160),
            y: gsap.utils.clamp(0, maxY, mousePos.y - 110),
            rotation: speed * (mousePos.x > lastMousePos.current.x ? 1 : -1),
            ease: "back.out(2)",
            duration: 1.25,
            opacity: 1
          })
        }
        lastMousePos.current = mousePos
        return () => ctx.revert()
      }, component)
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [currentItem])


  const contentImages = items.map((item) => {
    const image = isFilled.image(item.data.hover_image) ? item.data.hover_image : fallbackItemImage

    return asImageSrc(image, {
      fit: "clamp",
      w: "320",
      h: "220",
      exp: -15
    })
  })

  useEffect(() => {
    contentImages.forEach((url) => {
      if(!url) return
      const img = new Image()
      img.src = url
    })
  }, [contentImages])

  const onMouseEnter = (index: number) => {
    setCurrentItem(index)
  }
  const onMouseLeave = () => {
    setCurrentItem(null)
  }


  return (
    <div>
        <ul className='grid border-b border-b-slate-200' onMouseLeave={onMouseLeave}>
          {items.map((item, index) => (
            <>
              {isFilled.keyText(item.data.title) && (  
                <li key={index} className='list-item opacity-0' onMouseEnter={() => onMouseEnter(index)} ref={(el) => (itemsRef.current[index] = el)}>
                  <Link href={urlPrefixes + "/" + item.uid} className='flex flex-col justify-between border-t border-t-slate-200 py-10 text-slate-300 md:flex-row' aria-label={item.data.title}>
                    <div className='flex flex-col'>
                      <span className='text-3xl font-bold'>{item.data.title}</span>
                      <div className='flex gap-3 text-yellow-500 text-lg font-bold'>
                        {item.tags.map((tag, index) => (
                          <span key={index}>{tag}  </span>
                        ))}
                      </div>
                    </div>
                  <span className='ml-auto flex items-center gap-2 text-xl font-medium md:ml-0'>{viewMoreText} <MdArrowOutward /></span>
                  </Link>
                </li>
              )}
            </>
          ))}
        </ul>

        <div className='hover-reveal pointer-events-none absolute left-0 top-0 -z-10 h-[220px] w-[320px] rounded-lg bg-over bg-center opacity-0 transition-[background] duration-300' style={{
          backgroundImage: currentItem !== null ? `url(${contentImages[currentItem]})` : ""
        }} ref={revealRef}></div>
    </div>
  )
}
