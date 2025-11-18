<script setup lang="ts">
import { ref, computed } from 'vue'

interface User {
  id: string
  name: string
  username: string
  avatar: string | null
  reputation: number
}

interface Review {
  id: string
  rating: number
  title: string
  content: string
  pros: string[]
  cons: string[]
  verified: boolean
  helpfulCount: number
  createdAt: string
  user: User
}

const props = defineProps<{
  review: Review
}>()

const emit = defineEmits<{
  vote: [reviewId: string, helpful: boolean]
  removeVote: [reviewId: string]
}>()

const userVote = ref<boolean | null>(null) // null = no vote, true = helpful, false = not helpful
const isVoting = ref(false)

const formattedDate = computed(() => {
  return new Date(props.review.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const userInitials = computed(() => {
  return props.review.user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

async function handleVote(helpful: boolean) {
  if (isVoting.value) return

  isVoting.value = true

  try {
    if (userVote.value === helpful) {
      // Remove vote
      await $fetch(`/api/reviews/${props.review.id}/vote`, {
        method: 'DELETE',
      })
      userVote.value = null
      emit('removeVote', props.review.id)
    } else {
      // Add or update vote
      await $fetch(`/api/reviews/${props.review.id}/vote?helpful=${helpful}`, {
        method: 'POST',
      })
      userVote.value = helpful
      emit('vote', props.review.id, helpful)
    }
  } catch (error) {
    console.error('Failed to vote:', error)
  } finally {
    isVoting.value = false
  }
}
</script>

<template>
  <div class="review-card">
    <!-- Header -->
    <div class="review-header">
      <div class="user-info">
        <div class="avatar">
          <img v-if="review.user.avatar" :src="review.user.avatar" :alt="review.user.name" />
          <span v-else>{{ userInitials }}</span>
        </div>
        <div class="user-details">
          <div class="user-name-row">
            <span class="user-name">{{ review.user.name }}</span>
            <span v-if="review.verified" class="verified-badge">
              <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Verified Purchase
            </span>
          </div>
          <span class="user-username">@{{ review.user.username }}</span>
        </div>
      </div>
      <span class="review-date">{{ formattedDate }}</span>
    </div>

    <!-- Rating -->
    <div class="rating-row">
      <div class="stars">
        <svg
          v-for="star in 5"
          :key="star"
          class="star"
          :class="{ 'star-filled': star <= review.rating }"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>
      <span class="rating-text">{{ review.rating }}/5</span>
    </div>

    <!-- Title -->
    <h4 class="review-title">{{ review.title }}</h4>

    <!-- Content -->
    <p class="review-content">{{ review.content }}</p>

    <!-- Pros and Cons -->
    <div v-if="review.pros.length > 0 || review.cons.length > 0" class="pros-cons">
      <div v-if="review.pros.length > 0" class="pros">
        <h5 class="section-title">
          <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Pros
        </h5>
        <ul class="list">
          <li v-for="(pro, index) in review.pros" :key="index">{{ pro }}</li>
        </ul>
      </div>
      <div v-if="review.cons.length > 0" class="cons">
        <h5 class="section-title">
          <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Cons
        </h5>
        <ul class="list">
          <li v-for="(con, index) in review.cons" :key="index">{{ con }}</li>
        </ul>
      </div>
    </div>

    <!-- Footer with helpful votes -->
    <div class="review-footer">
      <div class="helpful-section">
        <span class="helpful-label">Was this helpful?</span>
        <div class="vote-buttons">
          <button
            class="vote-button"
            :class="{ active: userVote === true }"
            :disabled="isVoting"
            @click="handleVote(true)"
          >
            <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            Yes
          </button>
          <button
            class="vote-button"
            :class="{ active: userVote === false }"
            :disabled="isVoting"
            @click="handleVote(false)"
          >
            <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
            </svg>
            No
          </button>
        </div>
      </div>
      <span v-if="review.helpfulCount > 0" class="helpful-count">
        {{ review.helpfulCount }} {{ review.helpfulCount === 1 ? 'person' : 'people' }} found this helpful
      </span>
    </div>
  </div>
</template>

<style scoped>
.review-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  padding: 20px;
  transition: all 0.2s ease;
}

.review-card:hover {
  border-color: var(--border-secondary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.user-info {
  display: flex;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--accent-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.verified-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--accent-secondary);
  padding: 2px 8px;
  background: rgba(34, 197, 94, 0.1);
  border-radius: 12px;
}

.verified-badge .icon {
  width: 14px;
  height: 14px;
}

.user-username {
  font-size: 13px;
  color: var(--text-secondary);
}

.review-date {
  font-size: 13px;
  color: var(--text-secondary);
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  width: 16px;
  height: 16px;
  color: var(--border-primary);
}

.star-filled {
  color: #fbbf24;
}

.rating-text {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
}

.review-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.review-content {
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.6;
  margin: 0 0 16px 0;
}

.pros-cons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 6px;
}

.pros,
.cons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.section-title .icon-sm {
  width: 14px;
  height: 14px;
}

.pros .section-title {
  color: var(--accent-secondary);
}

.cons .section-title {
  color: var(--accent-primary);
}

.list {
  margin: 0;
  padding-left: 20px;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.list li {
  margin-bottom: 4px;
}

.review-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-primary);
}

.helpful-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.helpful-label {
  font-size: 13px;
  color: var(--text-secondary);
}

.vote-buttons {
  display: flex;
  gap: 8px;
}

.vote-button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 6px;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.vote-button:hover:not(:disabled) {
  border-color: var(--accent-primary);
  color: var(--accent-primary);
}

.vote-button.active {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
  color: white;
}

.vote-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.vote-button .icon-sm {
  width: 16px;
  height: 16px;
}

.helpful-count {
  font-size: 13px;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .review-header {
    flex-direction: column;
    gap: 8px;
  }

  .review-footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .pros-cons {
    grid-template-columns: 1fr;
  }
}
</style>
