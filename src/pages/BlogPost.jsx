import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Book, Clock } from '../components/Icons';
import { EASE, Reveal, StaggerGrid, StaggerItem } from '../components/Motion';
import { blogPosts, getPost } from '../data/content';

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPost(slug);

  if (!post) {
    return (
      <div className="shell flex flex-col items-center gap-5 py-28 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-3xl bg-sand-100 text-ink-400">
          <Book className="h-7 w-7" />
        </span>
        <h1 className="text-3xl font-extrabold">That article is not here</h1>
        <p className="max-w-sm text-sm leading-relaxed text-ink-500">
          It may have been renamed. The rest of the Field Notes are still up.
        </p>
        <Link to="/blog" className="btn btn-lg btn-primary">
          Back to the blog
        </Link>
      </div>
    );
  }

  const more = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <article className="pt-8 sm:pt-12">
      <div className="shell">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-ink-400">
          <Link to="/blog" className="inline-flex items-center gap-1.5 hover:text-leaf-700">
            <ArrowLeft className="h-3.5 w-3.5" />
            Field Notes
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-ink-600">{post.category}</span>
        </nav>

        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mx-auto mt-6 max-w-3xl text-center"
        >
          <p className="eyebrow">{post.category}</p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">{post.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-500">{post.excerpt}</p>
          <p className="mt-5 flex items-center justify-center gap-4 text-xs text-ink-400">
            <span>{post.date}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime}
            </span>
          </p>
        </motion.header>

        <motion.img
          src={post.image}
          alt={post.alt}
          width="900"
          height="600"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
          className="mx-auto mt-10 aspect-[16/9] w-full max-w-4xl rounded-4xl object-cover shadow-soft"
        />

        {/* Body */}
        <div className="mx-auto mt-14 max-w-2xl">
          {post.body.map((section, i) => (
            <Reveal key={section.heading} delay={i * 0.04} className="mb-10">
              <h2 className="font-display text-2xl font-bold">{section.heading}</h2>
              <p className="mt-3 text-base leading-[1.75] text-ink-600">{section.text}</p>
            </Reveal>
          ))}

          <Reveal className="mt-14 rounded-3xl bg-leaf-50 p-7">
            <p className="text-sm leading-relaxed text-leaf-900">
              <span className="font-bold">A note on advice.</span> This is general information written for adults,
              not medical guidance. If you take prescription medication or are pregnant, talk to a healthcare
              professional before using cannabis.
            </p>
          </Reveal>
        </div>
      </div>

      {/* More reading */}
      <section className="shell mt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-2xl font-extrabold">Keep reading</h2>
          <Link to="/blog" className="btn btn-md btn-secondary">
            All articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <StaggerGrid className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
          {more.map((item) => (
            <StaggerItem key={item.slug}>
              <motion.article
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="card group h-full overflow-hidden transition-shadow duration-300 hover:shadow-lift"
              >
                <Link to={`/blog/${item.slug}`} className="flex h-full flex-col">
                  <img
                    src={item.image}
                    alt={item.alt}
                    loading="lazy"
                    width="900"
                    height="600"
                    className="aspect-[3/2] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-leaf-700">{item.category}</p>
                    <h3 className="mt-2 font-display text-base font-bold leading-snug">{item.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">{item.excerpt}</p>
                  </div>
                </Link>
              </motion.article>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>
    </article>
  );
}
