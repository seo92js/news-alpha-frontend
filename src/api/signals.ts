import api from '@/api/axios'
import type { Signal, SignalDetail } from '@/types/signal'

export const fetchSignals = (): Promise<Signal[]> =>
  api.get<Signal[]>('/signals').then(r => r.data)

export const fetchSignalDetail = (signalId: number) : Promise<SignalDetail> =>
  api.get<SignalDetail>(`/signals/${signalId}`).then(r => r.data)