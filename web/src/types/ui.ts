import React from 'react'

// ModernInput component interfaces
export interface ModernInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 
  'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration' |
  'onDrag' | 'onDragEnd' | 'onDragStart' | 'onDragEnter' | 'onDragExit' | 'onDragLeave' | 'onDragOver' | 'onDrop'
> {
  label?: string
  error?: string
  icon?: React.ReactNode
  glow?: boolean
  className?: string
  placeholder?: string
  type?: string
  value?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  name?: string
  id?: string
  disabled?: boolean
  required?: boolean
}

// ModernButton component interfaces
export interface ModernButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 
  'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration' |
  'onDrag' | 'onDragEnd' | 'onDragStart' | 'onDragEnter' | 'onDragExit' | 'onDragLeave' | 'onDragOver' | 'onDrop'
> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  glow?: boolean
  gradient?: boolean
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  children?: React.ReactNode
}

// ModernCard component interfaces
export interface ModernCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
  gradient?: boolean
}

// Select component interfaces
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 
  'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration' |
  'onDrag' | 'onDragEnd' | 'onDragStart' | 'onDragEnter' | 'onDragExit' | 'onDragLeave' | 'onDragOver' | 'onDrop'
> {
  label?: string
  error?: string
  options: Array<{ value: string; label: string }>
  className?: string
  disabled?: boolean
}
