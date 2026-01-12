import { useEffect, useId, useRef, useState } from 'react'

interface UseExpandableClampOptions {
  /** 何行で省略表示するか (Tailwind の line-clamp-n を想定) */
  maxLine?: number
}

export const useExpandableClamp = <T extends HTMLElement = HTMLElement>({
  maxLine = 2,
}: UseExpandableClampOptions = {}) => {
  const id = useId()

  // Tailwind CSS の動的クラス名問題を回避するため、完全なクラス名を使用
  const getClampClass = (lines: number): string => {
    switch (lines) {
      case 1:
        return 'line-clamp-1'
      case 2:
        return 'line-clamp-2'
      case 3:
        return 'line-clamp-3'
      case 4:
        return 'line-clamp-4'
      case 5:
        return 'line-clamp-5'
      case 6:
        return 'line-clamp-6'
      default:
        return 'line-clamp-2'
    }
  }

  const clampClass = getClampClass(maxLine)

  const [isExpanded, setIsExpanded] = useState(false)
  const [isClamped, setIsClamped] = useState(false)
  const targetRef = useRef<T | null>(null)

  useEffect(() => {
    const el = targetRef.current
    if (!el) return

    el.classList.add(clampClass)

    // コンテンツ全体の高さ
    const fullHeight = el.scrollHeight
    // 実際に表示されている高さ（line-clamp による制限後）
    const visibleHeight = el.clientHeight

    const clamped = fullHeight > visibleHeight + 1

    setIsClamped(clamped)
    setIsExpanded(false)
  }, [clampClass])

  const toggle = () => {
    const el = targetRef.current
    if (!el) return

    if (isExpanded) {
      el.classList.add(clampClass)
      setIsExpanded(false)
    } else {
      el.classList.remove(clampClass)
      setIsExpanded(true)
    }
  }

  const getTextProps = () => {
    return {
      id,
      ref: targetRef,
      className: [!isExpanded ? clampClass : ''].filter(Boolean).join(' '),
    }
  }

  const getToggleButtonProps = () => ({
    type: 'button' as const,
    onClick: toggle,
    'aria-expanded': isExpanded,
    'aria-controls': id,
  })

  return {
    getTextProps, // 対象要素に付与する props (ref, className) を返す関数
    getToggleButtonProps, // トグルボタンに付与する props を返す関数
    toggle, // 省略表示 / 全文表示 を切り替える関数
    isClamped, // 現在「省略表示」状態か
    isExpanded, // 現在「全文表示」状態か
  }
}
