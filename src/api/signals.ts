import api from '@/api/axios'
import type { SignalDetail } from '@/types/signal'

export const fetchSignalDetail = (signalId: number) : Promise<SignalDetail> =>
  api.get<SignalDetail>(`/signals/${signalId}`).then(r => r.data)