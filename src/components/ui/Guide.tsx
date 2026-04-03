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
          <>
            {/* Dim background — click to close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.4)',
                zIndex: 90,
              }}
            />

            {/* Side panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              style={{
                position: 'fixed',
                top: 0, right: 0, bottom: 0,
                width: '320px',
                maxWidth: '85vw',
                background: '#0f172a',
                borderLeft: '1px solid #1e293b',
                zIndex: 95,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Header */}
              <div style={{
                padding: '20px 20px 16px',
                borderBottom: '1px solid #1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>🌌</span>
                  <span style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: 700 }}>사용 가이드</span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    width: '28px', height: '28px', borderRadius: '6px',
                    background: '#1e293b', border: 'none',
                    color: '#94a3b8', fontSize: '14px',
                    cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Scrollable content */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px 20px 20px',
              }}>
                <Section title="조작법" color="#60a5fa">
                  <Row icon="🖱️" label="좌클릭 드래그" value="시점 회전" />
                  <Row icon="🤚" label="우클릭 드래그" value="카메라 이동" />
                  <Row icon="🔍" label="스크롤" value="확대 / 축소" />
                  <Row icon="⌨️" label="ESC" value="뒤로 가기" />
                </Section>

                <Section title="탐색" color="#a78bfa">
                  <Row icon="🪐" label="행성 클릭" value="해당 과목으로 이동" />
                  <Row icon="🌙" label="달 클릭" value="입문 튜토리얼" />
                  <Row icon="☀️" label="태양 클릭" value="최종 도전" />
                  <Row icon="🏷️" label="상단 메뉴" value="과목 빠른 이동" />
                </Section>

                <Section title="문제 풀기" color="#4ade80">
                  <Row icon="⭐" label="별 호버" value="문제 미리보기" />
                  <Row icon="✏️" label="별 클릭" value="풀이 화면 진입" />
                  <Row icon="🔒" label="보라색 별" value="이전 단계 완료 필요" />
                  <Row icon="💡" label="추천 문제" value="하단 버튼 활용" />
                </Section>

                <Section title="성장" color="#fbbf24">
                  <Row icon="✨" label="XP 획득" value="난이도별 XP" />
                  <Row icon="🔥" label="연속 보너스" value="3연속 시 1.5배" />
                  <Row icon="📈" label="티어 해금" value="70% 달성 시" />
                  <Row icon="☀️" label="최종 도전" value="3개 행성 심화" />
                </Section>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        marginBottom: '6px',
      }}>
        <div style={{ width: '3px', height: '12px', background: color, borderRadius: '2px' }} />
        <span style={{ color, fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px' }}>
          {title}
        </span>
      </div>
      <div style={{
        background: '#1e293b',
        borderRadius: '8px',
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
      padding: '8px 12px',
      borderBottom: '1px solid rgba(15,23,42,0.8)',
      gap: '8px',
    }}>
      <span style={{ fontSize: '14px', width: '20px', textAlign: 'center', flexShrink: 0 }}>{icon}</span>
      <span style={{ color: '#e2e8f0', fontSize: '12px', fontWeight: 600, width: '90px', flexShrink: 0 }}>{label}</span>
      <span style={{ color: '#94a3b8', fontSize: '12px' }}>{value}</span>
    </div>
  )
}
