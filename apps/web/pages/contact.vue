<template>
  <div class="min-h-screen py-8">
    <div class="container-custom max-w-4xl">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-h1 mb-4">Contact Us</h1>
        <p class="text-text-secondary">
          Have a question or feedback? We'd love to hear from you.
        </p>
      </div>

      <div class="grid lg:grid-cols-3 gap-8 mb-12">
        <!-- Contact Info Cards -->
        <div class="card p-6 text-center">
          <div class="w-12 h-12 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
            <svg class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-h4 mb-2">Email</h3>
          <a href="mailto:support@comparo.com" class="text-accent hover:underline">
            support@comparo.com
          </a>
        </div>

        <div class="card p-6 text-center">
          <div class="w-12 h-12 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
            <svg class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 class="text-h4 mb-2">Live Chat</h3>
          <p class="text-text-secondary text-sm">
            Available Mon-Fri<br/>9 AM - 5 PM EST
          </p>
        </div>

        <div class="card p-6 text-center">
          <div class="w-12 h-12 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
            <svg class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-h4 mb-2">Help Center</h3>
          <NuxtLink to="/faq" class="text-accent hover:underline">
            Visit FAQ
          </NuxtLink>
        </div>
      </div>

      <!-- Contact Form -->
      <div class="card p-8">
        <h2 class="text-h2 mb-6">Send us a message</h2>

        <form v-if="!submitted" @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Name -->
          <div>
            <label for="name" class="block text-sm font-medium mb-2">
              Full Name <span class="text-error">*</span>
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="w-full px-4 py-2 rounded-lg border border-border-primary bg-primary-secondary focus:outline-none focus:border-accent"
              placeholder="John Doe"
            />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium mb-2">
              Email Address <span class="text-error">*</span>
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-2 rounded-lg border border-border-primary bg-primary-secondary focus:outline-none focus:border-accent"
              placeholder="john@example.com"
            />
          </div>

          <!-- Subject -->
          <div>
            <label for="subject" class="block text-sm font-medium mb-2">
              Subject <span class="text-error">*</span>
            </label>
            <select
              id="subject"
              v-model="form.subject"
              required
              class="w-full px-4 py-2 rounded-lg border border-border-primary bg-primary-secondary focus:outline-none focus:border-accent"
            >
              <option value="">Select a subject</option>
              <option value="general">General Inquiry</option>
              <option value="support">Technical Support</option>
              <option value="feature">Feature Request</option>
              <option value="bug">Report a Bug</option>
              <option value="partnership">Partnership Inquiry</option>
              <option value="other">Other</option>
            </select>
          </div>

          <!-- Message -->
          <div>
            <label for="message" class="block text-sm font-medium mb-2">
              Message <span class="text-error">*</span>
            </label>
            <textarea
              id="message"
              v-model="form.message"
              required
              rows="6"
              class="w-full px-4 py-2 rounded-lg border border-border-primary bg-primary-secondary focus:outline-none focus:border-accent resize-none"
              placeholder="Tell us how we can help..."
            ></textarea>
          </div>

          <!-- Submit Button -->
          <div class="flex items-center gap-4">
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="submitting"
            >
              <span v-if="!submitting">Send Message</span>
              <span v-else class="flex items-center gap-2">
                <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            </button>

            <span class="text-sm text-text-tertiary">
              We'll respond within 24 hours
            </span>
          </div>
        </form>

        <!-- Success Message -->
        <div v-else class="text-center py-8">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-success-light flex items-center justify-center">
            <svg class="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-h3 mb-2">Message Sent!</h3>
          <p class="text-text-secondary mb-6">
            Thank you for contacting us. We'll get back to you soon.
          </p>
          <button class="btn btn-primary" @click="resetForm">
            Send Another Message
          </button>
        </div>
      </div>

      <!-- FAQ Link -->
      <div class="mt-8 text-center">
        <p class="text-text-secondary mb-2">
          Looking for quick answers?
        </p>
        <NuxtLink to="/faq" class="text-accent hover:underline font-medium">
          Check out our FAQ section →
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const submitting = ref(false)
const submitted = ref(false)

const handleSubmit = async () => {
  submitting.value = true

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))

  // In a real app, send the form data to your API
  console.log('Form submitted:', form.value)

  submitting.value = false
  submitted.value = true
}

const resetForm = () => {
  form.value = {
    name: '',
    email: '',
    subject: '',
    message: '',
  }
  submitted.value = false
}

// SEO
useHead({
  title: 'Contact Us - Comparo',
  meta: [
    {
      name: 'description',
      content: 'Get in touch with the Comparo team. We\'re here to help with questions, feedback, and support.',
    },
  ],
})
</script>
