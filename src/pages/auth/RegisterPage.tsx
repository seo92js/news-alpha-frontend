import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

import Card from '@/components/ui/card'
import Input from '@/components/ui/input'
import Button from '@/components/ui/button'
import { signup } from '@/api/auth'

const schema = z
  .object({
    nickname: z.string().min(2, '닉네임은 최소 2자 이상').max(20, '닉네임은 최대 20자'),
    email: z.string().email('올바른 이메일 형식이 아닙니다'),
    password: z.string().min(8, '비밀번호는 최소 8자 이상'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

export default function RegisterPage() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormValues) => {
    setServerError('')
    setSuccessMessage('')
    setIsLoading(true)
    try {
      await signup({ email: data.email, password: data.password, nickname: data.nickname })
      setSuccessMessage('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.')
      timerRef.current = setTimeout(() => navigate('/login'), 1500)
    }
    catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = (err.response?.data as { message?: string })?.message
        setServerError(msg ?? '오류가 발생했습니다')
      }
      else {
        setServerError('오류가 발생했습니다')
      }
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-6">
        <div className="max-w-[400px] w-full animate-[fadeInUp_300ms_ease-out]">
          <Card>
            <div className="flex flex-col gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-[22px] text-text-primary font-bold tracking-[-0.5px]">News</span>
                  <span className="text-[11px] font-semibold text-bg bg-accent rounded px-[6px] py-[2px] tracking-[1px]">ALPHA</span>
                </div>
                <p className="text-[14px] text-text-muted">새 계정 만들기</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                {successMessage && (
                    <p className="text-[14px] text-success">{successMessage}</p>
                )}
                <Input
                  label="닉네임"
                  type="text"
                  error={errors.nickname?.message}
                  {...register('nickname')}
                />
                <Input
                  label="이메일"
                  type="email"
                  error={errors.email?.message}
                  {...register('email')}
                />
                <Input
                  label="비밀번호"
                  type="password"
                  error={errors.password?.message}
                  {...register('password')}
                />
                <Input
                  label="비밀번호 확인"
                  type="password"
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                />
                {serverError && (
                    <p className="text-[14px] text-error">{serverError}</p>
                )}
                <Button type="submit" fullWidth loading={isLoading} className="h-12 text-[15px]">
                  회원가입
                </Button>
              </form>

              <p className="text-center text-[14px] text-text-muted">
                이미 계정이 있으신가요?{' '}
                <Link to="/login" className="text-accent no-underline font-semibold">
                  로그인
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
  )
}