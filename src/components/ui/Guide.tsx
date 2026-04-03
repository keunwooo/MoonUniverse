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
              position: 'fixed', inset: 0, zIndex: 100,
              background: 'rgba(0,0,0,0.85)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(4px)',
            }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'rgba(15,23,42,0.98)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                padding: '2rem',
                maxWidth: '480px',
                width: '90%',
                maxHeight: '80vh',
                overflowY: 'auto',
              }}
            >
              <h2 style={{ color: '#f1f5f9', fontSize: '1.3rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                🌌 MoonUniverse 사용 가이드
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <GuideItem icon="🖱️" title="기본 조작">
                  마우스 드래그로 시점 회전, 스크롤로 확대/축소
                </GuideItem>
                <GuideItem icon="🪐" title="행성 선택">
                  행성을 클릭하거나 상단 메뉴에서 과목을 선택하세요
                </GuideItem>
                <GuideItem icon="⭐" title="문제 풀기">
                  빛나는 별 위에 마우스를 올리면 미리보기, 클릭하면 문제 풀이
                </GuideItem>
                <GuideItem icon="🔒" title="잠긴 별">
                  보라색 별은 이전 단계를 완료해야 풀 수 있어요
                </GuideItem>
                <GuideItem icon="🌙" title="달 (입문)">
                  행성 주위를 도는 달은 입문 튜토리얼이에요
                </GuideItem>
                <GuideItem icon="📈" title="진행도">
                  문제를 풀면 XP를 얻고 레벨업! 연속 정답 시 보너스
                </GuideItem>
                <GuideItem icon="☀️" title="최종 도전">
                  3개 이상 행성에서 심화 단계 도달 시 태양 도전 해금
                </GuideItem>
                <GuideItem icon="⌨️" title="단축키">
                  ESC: 뒤로 가기 / Enter: 답 제출
                </GuideItem>
              </div>

              <button
                onClick={() => setOpen(false)}
                style={{
                  marginTop: '1.5rem',
                  width: '100%',
                  padding: '0.7rem',
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                시작하기
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function GuideItem({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
      <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>{icon}</span>
      <div>
        <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.9rem', marginBottom: '2px' }}>{title}</div>
        <div style={{ color: '#94a3b8', fontSize: '0.8rem', lineHeight: 1.5 }}>{children}</div>
      </div>
    </div>
  )
}
