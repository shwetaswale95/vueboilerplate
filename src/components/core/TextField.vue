<template>
    <div>
        <v-col
          sm="12"
          md="12"
          lg="12"
        >
          <v-text-field
            v-model="field.text"
            :label="field.label"
            outlined
          ></v-text-field>
        </v-col>
    </div>
</template>

<script>
export default {
    name: 'textField',
    props:  ['fields'],
    data() {
        return {
          field: this.fields
        };
    },
    created() {
        this.$emit("fields", this.field);
    },
}
</script>