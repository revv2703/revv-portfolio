import { KeyTextField, LinkField, RichTextField } from "@prismicio/client"
import { PrismicNextLink } from "@prismicio/next"
import { PrismicRichText } from "@prismicio/react"
import clsx from "clsx"
import { FaExternalLinkAlt } from "react-icons/fa";



type ButtonProps = {
    linkField: LinkField
    label: RichTextField
    // label: KeyTextField
    showIcon?: boolean
    className?: string
}

export default function Button({linkField, label, showIcon = true, className}: ButtonProps){
    return (
        <PrismicNextLink field={linkField} className={clsx("group relative text-slate-900 flex w-fit items-center justify-center overflow-hidden rounded-lg border-2 border-slate-900 bg-slate-50 px-4 py-2 font-bold transition-transform ease-out hoveer:scale-105", className)}>
            <span className="absolute inset-0 z-0 h-full translate-y-9 bg-orange-400 transition-transform duration-300 ease-in-out group-hover:translate-y-0"></span>
            <span className="relative flex items-center justify-center gap-2">
                {<PrismicRichText field={label} />} {showIcon && <FaExternalLinkAlt className="inline-block"/>}
            </span>
        </PrismicNextLink>
    )
}