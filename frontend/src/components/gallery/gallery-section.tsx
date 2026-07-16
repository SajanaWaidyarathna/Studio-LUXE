"use client";

import Image from "next/image";
import { motion } from "framer-motion";


const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1562322140-8baeececf3df",
    title: "Hair Styling",
  },
  {
    src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e",
    title: "Hair Coloring",
  },
  {
    src: "https://images.unsplash.com/photo-1560066984-138dadb4c035",
    title: "Luxury Salon",
  },
  {
    src: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250",
    title: "Professional Care",
  },
  {
    src: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937",
    title: "Beauty Treatment",
  },
  {
    src: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f",
    title: "Salon Experience",
  },
];


export default function GallerySection(){

return (

<section 
id="gallery"
className="bg-[#FAF7F2] py-28"
>


<div className="mx-auto max-w-7xl px-6">


{/* Heading */}

<div className="text-center mb-16">

<p className="uppercase tracking-[0.35em] text-[#C9A227]">
Our Gallery
</p>


<h2 className="
mt-4
text-5xl
font-semibold
text-[#1C1C1C]
">
Where beauty comes to life
</h2>


<p className="
mt-5
mx-auto
max-w-2xl
text-[#4A4A4A]
">
Explore our latest styles, transformations,
and the luxury experience at Luxe Studio.
</p>

</div>



{/* Gallery */}

<div className="
grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-3
gap-6
">


{
galleryImages.map((image,index)=>(

<motion.div

key={image.title}

initial={{
opacity:0,
y:40
}}

whileInView={{
opacity:1,
y:0
}}

viewport={{
once:true
}}

transition={{
duration:0.6,
delay:index*0.1
}}

className="
group
relative
overflow-hidden
rounded-3xl
h-[420px]
"

>


<Image

src={image.src}

alt={image.title}

fill

className="
object-cover
transition
duration-700
group-hover:scale-110
"

/>


{/* Overlay */}

<div className="
absolute
inset-0
bg-black/0
group-hover:bg-black/40
transition
duration-500
"/>


<div className="
absolute
bottom-8
left-8
text-white
opacity-0
group-hover:opacity-100
transition
duration-500
">

<h3 className="
text-2xl
font-semibold
">
{image.title}
</h3>

</div>


</motion.div>


))
}


</div>


</div>


</section>

)

}