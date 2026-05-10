import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { login } from '../../api/auth'
import { useAuthStore } from '../../stores/authStore'

const schema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
})

type FormValues = z.infer<typeof schema>

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

export default function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [serverError, setServerError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormValues) => {
    setServerError('')
    setIsLoading(true)
    try {
      const res = await login(data)
      setAuth(res.token, { email: res.email, role: res.role })
      navigate('/')
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
              <p className="text-[14px] text-text-muted">만나서 반갑습니다</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
              {serverError && (
                  <p className="text-[14px] text-error">{serverError}</p>
              )}
              <Button type="submit" fullWidth loading={isLoading}>
                로그인
              </Button>
            </form>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[13px] text-text-muted whitespace-nowrap">또는</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <Button type="button" variant="secondary" fullWidth disabled>
              <GoogleIcon />
              Google로 계속하기
            </Button>

            <p className="text-center text-[14px] text-text-muted">
              계정이 없으신가요?{' '}
              <Link to="/register" className="text-accent no-underline font-semibold">
                회원가입
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}