<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  productId: string
}>()

const emit = defineEmits<{
  submit: [review: any]
  cancel: []
}>()

const rating = ref(0)
const hoverRating = ref(0)
const title = ref('')
const content = ref('')
const pros = ref([''])
const cons = ref([''])
const isSubmitting = ref(false)
const errors = ref<Record<string, string>>({})

const displayRating = computed(() => hoverRating.value || rating.value)

const isValid = computed(() => {
  return rating.value > 0 && title.value.trim() !== '' && content.value.trim() !== ''
})

function setRating(value: number) {
  rating.value = value
  errors.value.rating = ''
}

function setHover(value: number) {
  hoverRating.value = value
}

function addPro() {
  pros.value.push('')
}

function removePro(index: number) {
  pros.value.splice(index, 1)
}

function addCon() {
  cons.value.push('')
}

function removeCon(index: number) {
  cons.value.splice(index, 1)
}

async function handleSubmit() {
  errors.value = {}

  // Validate
  if (rating.value === 0) {
    errors.value.rating = 'Please select a rating'
    return
  }
  if (!title.value.trim()) {
    errors.value.title = 'Title is required'
    return
  }
  if (!content.value.trim()) {
    errors.value.content = 'Review content is required'
    return
  }

  isSubmitting.value = true

  try {
    const reviewData = {
      productId: props.productId,
      rating: rating.value,
      title: title.value.trim(),
      content: content.value.trim(),
      pros: pros.value.filter(p => p.trim() !== ''),
      cons: cons.value.filter(c => c.trim() !== ''),
    }

    const response = await $fetch('/api/reviews', {
      method: 'POST',
      body: reviewData,
    })

    emit('submit', response)

    // Reset form
    rating.value = 0
    title.value = ''
    content.value = ''
    pros.value = ['']
    cons.value = ['']
  } catch (error: any) {
    if (error.data?.message) {
      errors.value.submit = error.data.message
    } else {
      errors.value.submit = 'Failed to submit review. Please try again.'
    }
  } finally {
    isSubmitting.value = false
  }
}

function handleCancel() {
  emit('cancel')
}
</script>

<template>
  <div class="review-form">
    <div class="form-header">
      <h3 class="form-title">Write a Review</h3>
      <p class="form-description">Share your experience with this product</p>
    </div>

    <form @submit.prevent="handleSubmit" class="form-content">
      <!-- Rating -->
      <div class="form-group">
        <label class="form-label">
          Your Rating <span class="required">*</span>
        </label>
        <div class="star-rating">
          <button
            v-for="star in 5"
            :key="star"
            type="button"
            class="star-button"
            :class="{ 'star-filled': star <= displayRating }"
            @click="setRating(star)"
            @mouseenter="setHover(star)"
            @mouseleave="setHover(0)"
          >
            <svg class="star-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        </div>
        <p v-if="errors.rating" class="error-message">{{ errors.rating }}</p>
      </div>

      <!-- Title -->
      <div class="form-group">
        <label for="title" class="form-label">
          Review Title <span class="required">*</span>
        </label>
        <input
          id="title"
          v-model="title"
          type="text"
          class="form-input"
          placeholder="Summarize your experience"
          maxlength="100"
        />
        <p v-if="errors.title" class="error-message">{{ errors.title }}</p>
      </div>

      <!-- Content -->
      <div class="form-group">
        <label for="content" class="form-label">
          Your Review <span class="required">*</span>
        </label>
        <textarea
          id="content"
          v-model="content"
          class="form-textarea"
          placeholder="Tell us more about your experience with this product"
          rows="5"
        ></textarea>
        <p v-if="errors.content" class="error-message">{{ errors.content }}</p>
      </div>

      <!-- Pros -->
      <div class="form-group">
        <label class="form-label">Pros</label>
        <div v-for="(pro, index) in pros" :key="index" class="list-item">
          <input
            v-model="pros[index]"
            type="text"
            class="form-input"
            placeholder="What did you like?"
          />
          <button
            v-if="pros.length > 1"
            type="button"
            class="remove-button"
            @click="removePro(index)"
          >
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <button type="button" class="add-button" @click="addPro">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add another pro
        </button>
      </div>

      <!-- Cons -->
      <div class="form-group">
        <label class="form-label">Cons</label>
        <div v-for="(con, index) in cons" :key="index" class="list-item">
          <input
            v-model="cons[index]"
            type="text"
            class="form-input"
            placeholder="What could be better?"
          />
          <button
            v-if="cons.length > 1"
            type="button"
            class="remove-button"
            @click="removeCon(index)"
          >
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <button type="button" class="add-button" @click="addCon">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add another con
        </button>
      </div>

      <!-- Submit error -->
      <p v-if="errors.submit" class="error-message submit-error">{{ errors.submit }}</p>

      <!-- Actions -->
      <div class="form-actions">
        <button
          type="button"
          class="btn btn-secondary"
          @click="handleCancel"
          :disabled="isSubmitting"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="!isValid || isSubmitting"
        >
          {{ isSubmitting ? 'Submitting...' : 'Submit Review' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.review-form {
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  padding: 24px;
}

.form-header {
  margin-bottom: 24px;
}

.form-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.form-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.required {
  color: var(--accent-primary);
}

.star-rating {
  display: flex;
  gap: 8px;
}

.star-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.star-button:hover {
  transform: scale(1.1);
}

.star-icon {
  width: 32px;
  height: 32px;
  color: var(--border-primary);
  transition: color 0.2s ease;
}

.star-filled .star-icon {
  color: #fbbf24;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-primary);
  border-radius: 6px;
  font-size: 14px;
  color: var(--text-primary);
  background: var(--bg-secondary);
  transition: border-color 0.2s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--accent-primary);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

.list-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

.remove-button {
  flex-shrink: 0;
  padding: 8px;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.remove-button:hover {
  background: var(--bg-secondary);
  color: var(--accent-primary);
}

.add-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: none;
  border: 1px dashed var(--border-primary);
  border-radius: 6px;
  font-size: 14px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-button:hover {
  border-color: var(--accent-primary);
  color: var(--accent-primary);
  background: var(--bg-secondary);
}

.icon {
  width: 16px;
  height: 16px;
}

.error-message {
  font-size: 13px;
  color: var(--accent-primary);
  margin: 0;
}

.submit-error {
  padding: 12px;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 6px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
}

.btn {
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--bg-tertiary);
}

.btn-primary {
  background: var(--accent-primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.9;
}
</style>
