import type BaseButton from '@/components/ui/BaseButton.vue'
import type BaseInput from '@/components/ui/BaseInput.vue'
import type BaseCard from '@/components/ui/BaseCard.vue'
import type BaseSelect from '@/components/ui/BaseSelect.vue'
import type BasePasswordInput from '@/components/ui/BasePasswordInput.vue'
import type BaseLabel from '@/components/ui/BaseLabel.vue'
import type BaseErrorMessage from '@/components/ui/BaseErrorMessage.vue'

declare module 'vue' {
  export interface GlobalComponents {
    BaseButton: typeof BaseButton
    BaseInput: typeof BaseInput
    BaseCard: typeof BaseCard
    BaseSelect: typeof BaseSelect
    BasePasswordInput: typeof BasePasswordInput
    BaseLabel: typeof BaseLabel
    BaseErrorMessage: typeof BaseErrorMessage
  }
}

export {}