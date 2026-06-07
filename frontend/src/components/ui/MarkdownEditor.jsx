// src/components/ui/MarkdownEditor.jsx
import { useState } from 'react'

// Minimal markdown → HTML renderer (no dependencies)
function renderMarkdown(md) {
  if (!md) return ''
  return md
    // headings
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-medium text-text mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm,  '<h2 class="text-lg font-medium text-text mt-8 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm,   '<h1 class="text-xl font-medium text-text mt-8 mb-4">$1</h1>')
    // bold + italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g,     '<strong class="text-text font-medium">$1</strong>')
    .replace(/\*(.+?)\*/g,         '<em class="italic">$1</em>')
    // inline code
    .replace(/`([^`]+)`/g, '<code class="text-xs font-mono bg-border px-1.5 py-0.5 rounded text-amber">$1</code>')
    // blockquote
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-2 border-border2 pl-4 text-text2 italic my-3">$1</blockquote>')
    // hr
    .replace(/^---$/gm, '<hr class="border-border my-6"/>')
    // links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-text underline underline-offset-2 hover:opacity-75" target="_blank">$1</a>')
    // unordered list
    .replace(/^\- (.+)$/gm, '<li class="text-sm text-text2 font-light ml-4 list-disc">$1</li>')
    .replace(/(<li.*<\/li>\n?)+/g, '<ul class="my-3 flex flex-col gap-1">$&</ul>')
    // paragraphs (double newline)
    .replace(/\n\n([^<])/g, '\n\n<p class="text-sm text-text2 font-light leading-loose my-3">$1')
    .replace(/([^>])\n\n/g, '$1</p>\n\n')
    // line breaks
    .replace(/\n/g, '<br/>')
}

/**
 * MarkdownEditor
 * Props:
 *   value    — markdown string
 *   onChange — called with new string
 */
export default function MarkdownEditor({ value, onChange }) {
  const [tab, setTab] = useState('write') // 'write' | 'preview'

  const inp = "w-full h-64 bg-bg2 border border-border rounded-b-lg px-3.5 py-3 text-sm font-light text-text placeholder-text3 outline-none focus:border-border2 transition-colors resize-none font-mono leading-relaxed"

  return (
    <div className="flex flex-col">
      {/* Tab bar */}
      <div className="flex border border-border rounded-t-lg overflow-hidden border-b-0">
        {['write', 'preview'].map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-xs font-medium capitalize transition-colors
              ${tab === t
                ? 'bg-bg2 text-text border-r border-border'
                : 'bg-bg text-text3 hover:text-text2 border-r border-border'
              }`}
          >
            {t}
          </button>
        ))}
        <div className="flex-1 bg-bg border-b border-border" />
        <span className="text-2xs text-text3 px-3 flex items-center bg-bg">Markdown</span>
      </div>

      {tab === 'write' ? (
        <textarea
          className={inp}
          placeholder={`# Post title\n\nWrite your content here...\n\n## Section\n\nParagraph text with **bold** and *italic* support.`}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      ) : (
        <div
          className="w-full min-h-64 bg-bg2 border border-border rounded-b-lg px-3.5 py-3 overflow-auto"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(value) || '<p class="text-sm text-text3">Nothing to preview yet.</p>' }}
        />
      )}

      {/* Toolbar hints */}
      <div className="flex gap-3 mt-1.5">
        {[['**bold**','B'],['*italic*','I'],['`code`','</>'],['## heading','H'],['- list','·']].map(([syntax, label]) => (
          <button
            key={label}
            type="button"
            onClick={() => onChange(value + syntax)}
            className="text-2xs text-text3 hover:text-text2 transition-colors font-mono"
            title={syntax}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
