import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const GUIDE_SECTIONS = [
  {
    category: '조작법',
    color: '#60a5fa',
    items: [
      { icon: '🖱️', title: '좌클릭 드래그', desc: '시점 회전' },
      { icon: '🤚', title: '우클릭 드래그', desc: '카메라 이동' },
      { icon: '🔍', title: '스크롤', desc: '확대 / 축소' },
      { icon: '⌨️', title: 'ESC', desc: '뒤로 가기' },
    ],
  },
  {
    category: '탐색',
    color: '#a78bfa',
    items: [
      { icon: '🪐', title: '행성 클릭', desc: '해당 과목으로 이동' },
      { icon: '🌙', title: '달 클릭', desc: '입문 튜토리얼 시작' },
      { icon: '☀️', title: '태양 클릭', desc: '최종 도전 (해금 필요)' },
      { icon: '🏷️', title: '상단 메뉴', desc: '과목 빠른 이동' },
    ],
  },
  {
    category: '문제 풀기',
    color: '#4ade80',
    items: [
      { icon: '⭐', title: '별 호버', desc: '문제 미리보기 표시' },
      { icon: '✏️', title: '별 클릭', desc: '문제 풀이 화면 진입' },
      { icon: '🔒', title: '보라색 별', desc: '이전 단계 완료 필요' },
      { icon: '💡', title: '추천 문제', desc: '하단의 추천 버튼 활용' },
    ],
  },
  {
    category: '성장',
    color: '#fbbf24',
    items: [
      { icon: '✨', title: 'XP 획득', desc: '정답 시 난이도별 XP' },
      { icon: '🔥', title: '연속 보너스', desc: '3연속 정답 시 1.5배' },
      { icon: '📈', title: '티어 해금', desc: '70% 달성 시 다음 단계' },
      { icon: '☀️', title: '최종 도전', desc: '3개 행성 심화 달성' },
    ],
  },
]

export default function Guide() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          color: '#94a3b8',
          fontSize: '0.7rem',
          padding: '4px 10px',
          cursor: 'pointer',
          marginTop: '0.5rem',
          width: '100%',
        }}
      >
        ❓ 사용 가이드
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 100,
              background: 'rgba(0,0,0,0.8)',
              display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
              backdropFilter: 'blur(8px)',
              overflowY: 'auto',
              padding: '4vh 1rem',
            }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                background: 'linear-gradient(180deg, rgba(15,23,42,0.98) 0%, rgba(10,15,30,0.99) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                padding: '2rem 1.8rem 1.5rem',
                maxWidth: '520px',
                width: '100%',
                flexShrink: 0,
              }}
            >
              {/* X close button */}
              <button
                onClick={() => setOpen(false)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#94a3b8',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1,
                  padding: 0,
                }}
              >
                ✕
              </button>

              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
                <div style={{ fontSize: '2.2rem', marginBottom: '0.4rem' }}>🌌</div>
                <h2 style={{
                  color: '#f1f5f9',
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  margin: 0,
                  letterSpacing: '1px',
                }}>
                  MoonUniverse
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.4rem' }}>
                  우주를 탐험하며 수학을 정복하세요
                </p>
              </div>

              {/* Sections */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                {GUIDE_SECTIONS.map((section, si) => (
                  <motion.div
                    key={section.category}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: si * 0.08 }}
                  >
                    {/* Section header */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      marginBottom: '0.7rem',
                    }}>
                      <div style={{
                        width: '3px', height: '16px',
                        background: section.color,
                        borderRadius: '2px',
                      }} />
                      <span style={{
                        color: section.color,
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                      }}>
                        {section.category}
                      </span>
                    </div>

                    {/* Items — single column list */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                    }}>
                      {section.items.map((item) => (
                        <div key={item.title} style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.05)',
                          borderRadius: '10px',
                          padding: '0.6rem 0.9rem',
                          display: 'flex',
                          gap: '0.7rem',
                          alignItems: 'center',
                        }}>
                          <span style={{
                            fontSize: '1.1rem',
                            flexShrink: 0,
                            width: '28px',
                            textAlign: 'center',
                          }}>
                            {item.icon}
                          </span>
                          <div style={{
                            color: '#e2e8f0',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            minWidth: '100px',
                            flexShrink: 0,
                          }}>
                            {item.title}
                          </div>
                          <div style={{
                            color: '#64748b',
                            fontSize: '0.8rem',
                          }}>
                            {item.desc}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Close button */}
              <button
                onClick={() => setOpen(false)}
                style={{
                  marginTop: '1.8rem',
                  width: '100%',
                  padding: '0.8rem',
                  background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  letterSpacing: '1px',
                }}
              >
                탐험 시작하기 🚀
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
