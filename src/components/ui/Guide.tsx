import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              zIndex: 100,
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(6px)',
            }}
            onClick={() => setOpen(false)}
          >
            {/* Scrollable container */}
            <div style={{
              width: '100%',
              height: '100%',
              overflowY: 'auto',
              display: 'flex',
              justifyContent: 'center',
              padding: '40px 16px',
            }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: '#0f172a',
                  border: '1px solid #1e293b',
                  borderRadius: '16px',
                  width: '100%',
                  maxWidth: '440px',
                  padding: '28px 24px',
                  alignSelf: 'flex-start',
                  position: 'relative',
                }}
              >
                {/* X button */}
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    position: 'absolute', top: '16px', right: '16px',
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: '#1e293b', border: 'none',
                    color: '#94a3b8', fontSize: '14px',
                    cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  ✕
                </button>

                {/* Title */}
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>🌌</div>
                  <div style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: 800 }}>
                    MoonUniverse
                  </div>
                  <div style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>
                    우주를 탐험하며 수학을 정복하세요
                  </div>
                </div>

                {/* Section: 조작법 */}
                <Section title="조작법" color="#60a5fa">
                  <Row icon="🖱️" label="좌클릭 드래그" value="시점 회전" />
                  <Row icon="🤚" label="우클릭 드래그" value="카메라 이동" />
                  <Row icon="🔍" label="스크롤" value="확대 / 축소" />
                  <Row icon="⌨️" label="ESC" value="뒤로 가기" />
                </Section>

                {/* Section: 탐색 */}
                <Section title="탐색" color="#a78bfa">
                  <Row icon="🪐" label="행성 클릭" value="해당 과목으로 이동" />
                  <Row icon="🌙" label="달 클릭" value="입문 튜토리얼 시작" />
                  <Row icon="☀️" label="태양 클릭" value="최종 도전 (해금 필요)" />
                  <Row icon="🏷️" label="상단 메뉴" value="과목 빠른 이동" />
                </Section>

                {/* Section: 문제 풀기 */}
                <Section title="문제 풀기" color="#4ade80">
                  <Row icon="⭐" label="별 호버" value="문제 미리보기" />
                  <Row icon="✏️" label="별 클릭" value="문제 풀이 진입" />
                  <Row icon="🔒" label="보라색 별" value="이전 단계 완료 필요" />
                  <Row icon="💡" label="추천 문제" value="하단 버튼 활용" />
                </Section>

                {/* Section: 성장 */}
                <Section title="성장" color="#fbbf24">
                  <Row icon="✨" label="XP 획득" value="정답 시 난이도별 XP" />
                  <Row icon="🔥" label="연속 보너스" value="3연속 정답 시 1.5배" />
                  <Row icon="📈" label="티어 해금" value="70% 달성 시 다음 단계" />
                  <Row icon="☀️" label="최종 도전" value="3개 행성 심화 달성" />
                </Section>

                {/* Button */}
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    marginTop: '20px', width: '100%', padding: '12px',
                    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                    border: 'none', borderRadius: '10px',
                    color: '#fff', fontSize: '15px', fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  탐험 시작하기 🚀
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        marginBottom: '8px',
      }}>
        <div style={{ width: '3px', height: '14px', background: color, borderRadius: '2px' }} />
        <span style={{ color, fontSize: '13px', fontWeight: 700, letterSpacing: '0.5px' }}>
          {title}
        </span>
      </div>
      <div style={{
        background: '#1e293b',
        borderRadius: '10px',
        overflow: 'hidden',
      }}>
        {children}
      </div>
    </div>
  )
}

function Row({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      padding: '10px 14px',
      borderBottom: '1px solid #0f172a',
      gap: '10px',
    }}>
      <span style={{ fontSize: '16px', width: '24px', textAlign: 'center', flexShrink: 0 }}>{icon}</span>
      <span style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 600, width: '100px', flexShrink: 0 }}>{label}</span>
      <span style={{ color: '#94a3b8', fontSize: '13px' }}>{value}</span>
    </div>
  )
}
