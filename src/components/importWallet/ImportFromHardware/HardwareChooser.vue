<template>
  <div class="column">
    <v-list
      v-model="hardwareType"
      :has-default-active="false"
      :list="hardwareList"
      label="Choose Hardware type"
    />
  </div>
</template>

<script>
import { WALLET_TYPE } from '@/constants';
import VList from '@/components/ui/VList';

const hardwareList = {
  [WALLET_TYPE.LEDGER]: 'Ledger wallet',
  [WALLET_TYPE.TREZOR]: 'Trezor wallet',
};

export default {
  name: 'HardwareChooser',
  data: () => ({
    hardwareType: null,
    hardwareList,
  }),
  watch: {
    hardwareType(type) {
      this.$emit('input', type);
    },
  },
  components: {
    VList,
  },
};
</script>

<style lang="scss">
</style>
