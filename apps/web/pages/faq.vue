<template>
  <div class="min-h-screen py-8">
    <div class="container-custom max-w-4xl">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-h1 mb-4">Frequently Asked Questions</h1>
        <p class="text-text-secondary">
          Find answers to common questions about Comparo
        </p>
      </div>

      <!-- Search -->
      <div class="mb-8">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search FAQs..."
          class="w-full px-4 py-3 rounded-lg border border-border-primary bg-primary-secondary focus:outline-none focus:border-accent"
        />
      </div>

      <!-- FAQ Categories -->
      <div class="flex flex-wrap gap-2 mb-8">
        <button
          v-for="category in faqCategories"
          :key="category"
          class="px-4 py-2 rounded-lg transition-all"
          :class="selectedCategory === category
            ? 'bg-accent text-white'
            : 'bg-primary-secondary text-text-secondary hover:bg-primary-tertiary'"
          @click="selectedCategory = category"
        >
          {{ category }}
        </button>
      </div>

      <!-- FAQ Accordion -->
      <div class="space-y-4">
        <div
          v-for="(faq, index) in filteredFaqs"
          :key="index"
          class="card overflow-hidden"
        >
          <button
            class="w-full p-6 text-left flex items-center justify-between hover:bg-primary-secondary transition-colors"
            @click="toggleFaq(index)"
          >
            <span class="text-h4 pr-4">{{ faq.question }}</span>
            <svg
              class="w-6 h-6 text-accent flex-shrink-0 transition-transform"
              :class="{ 'rotate-180': openFaqIndex === index }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="max-h-0 opacity-0"
            enter-to-class="max-h-96 opacity-100"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="max-h-96 opacity-100"
            leave-to-class="max-h-0 opacity-0"
          >
            <div
              v-if="openFaqIndex === index"
              class="px-6 pb-6 border-t border-divider"
            >
              <div class="pt-4 text-text-secondary leading-relaxed" v-html="faq.answer"></div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredFaqs.length === 0" class="text-center py-16">
        <svg class="w-24 h-24 mx-auto text-text-tertiary mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 class="text-h3 mb-2">No results found</h3>
        <p class="text-text-secondary mb-4">
          Try a different search query or browse all categories
        </p>
        <button class="btn btn-primary" @click="searchQuery = ''; selectedCategory = 'All'">
          Show All FAQs
        </button>
      </div>

      <!-- Contact Section -->
      <div class="mt-12 card p-8 text-center bg-gradient-to-br from-accent/5 to-accent-secondary/5 border-accent/20">
        <h2 class="text-h2 mb-2">Still have questions?</h2>
        <p class="text-text-secondary mb-6">
          Can't find the answer you're looking for? Our support team is here to help.
        </p>
        <NuxtLink to="/contact" class="btn btn-primary">
          Contact Support
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

interface Faq {
  category: string
  question: string
  answer: string
}

const searchQuery = ref('')
const selectedCategory = ref('All')
const openFaqIndex = ref<number | null>(null)

const faqs: Faq[] = [
  {
    category: 'General',
    question: 'What is Comparo?',
    answer: 'Comparo is a product comparison platform that helps you make informed purchasing decisions by comparing products side-by-side. We provide detailed specifications, expert reviews, user ratings, and intelligent highlighting of key differences.',
  },
  {
    category: 'General',
    question: 'How do I create an account?',
    answer: 'Click on the "Sign In" button in the top right corner, then select "Create Account". You\'ll need to provide your name, email address, and create a password. Once registered, you can save comparisons, write reviews, and create wishlists.',
  },
  {
    category: 'General',
    question: 'Is Comparo free to use?',
    answer: 'Yes! Comparo is completely free to use. You can browse products, create comparisons, read reviews, and use all our features without any subscription or payment.',
  },
  {
    category: 'Comparisons',
    question: 'How do I compare products?',
    answer: 'You can compare products in several ways:<br>1. Click "Add to Compare" on any product card<br>2. Use the comparison bar at the bottom of the page to manage your selection<br>3. Once you have 2 or more products, click "Compare Now" to see them side-by-side<br>4. Our intelligent highlighting will show you the key differences between products.',
  },
  {
    category: 'Comparisons',
    question: 'How many products can I compare at once?',
    answer: 'You can compare up to 4 products simultaneously. This limit ensures that comparisons remain clear and easy to understand.',
  },
  {
    category: 'Comparisons',
    question: 'Can I save my comparisons?',
    answer: 'Yes! If you\'re logged in, you can save your comparisons by clicking the "Save" button on the comparison page. Saved comparisons can be accessed from "My Comparisons" in your profile.',
  },
  {
    category: 'Comparisons',
    question: 'Can I share my comparisons?',
    answer: 'Absolutely! Each comparison has a unique URL that you can share with friends, family, or colleagues. You can also use the "Share" button to quickly share via social media or copy the link.',
  },
  {
    category: 'Products',
    question: 'How do I find products?',
    answer: 'You can find products by:<br>1. Using the search bar in the header<br>2. Browsing by category<br>3. Filtering products by price, brand, or features<br>4. Checking out our "New Arrivals" or "Best Deals" sections',
  },
  {
    category: 'Products',
    question: 'Are prices up to date?',
    answer: 'We work with various retailers and update prices regularly. However, prices can change frequently. We recommend checking the retailer\'s website for the most current pricing before making a purchase.',
  },
  {
    category: 'Products',
    question: 'Do you sell products directly?',
    answer: 'No, Comparo is a comparison platform only. We provide information to help you make decisions, but you purchase products directly from retailers. When you click "View Deals", you\'ll be redirected to the retailer\'s website.',
  },
  {
    category: 'Reviews',
    question: 'How do I write a review?',
    answer: 'To write a review:<br>1. Navigate to the product page<br>2. Scroll down to the Reviews section<br>3. Click "Write a Review"<br>4. Rate the product (1-5 stars) and share your experience<br>5. You can also add pros and cons to help others<br>Note: You must be logged in to write reviews.',
  },
  {
    category: 'Reviews',
    question: 'What are verified reviews?',
    answer: 'Verified reviews come from users who have purchased the product through our partner retailers. These reviews are marked with a "Verified Purchase" badge for added credibility.',
  },
  {
    category: 'Reviews',
    question: 'Can I edit or delete my review?',
    answer: 'Yes, you can edit or delete your reviews from the "My Reviews" page in your profile. You can update your rating, review text, pros, and cons at any time.',
  },
  {
    category: 'Wishlist',
    question: 'How does the wishlist work?',
    answer: 'The wishlist lets you save products you\'re interested in for later. Click the heart icon on any product to add it to your wishlist. You can access your wishlist anytime from the navigation menu or your profile.',
  },
  {
    category: 'Wishlist',
    question: 'Can I set price alerts?',
    answer: 'Yes! On your wishlist page, you can set a target price for any product. We\'ll notify you when the price drops to or below your target, helping you get the best deal.',
  },
  {
    category: 'Account',
    question: 'How do I change my password?',
    answer: 'Go to your profile settings and click on "Change Password". You\'ll need to enter your current password and then your new password twice to confirm.',
  },
  {
    category: 'Account',
    question: 'How do I delete my account?',
    answer: 'If you wish to delete your account, please contact our support team. We\'ll process your request and permanently remove all your data from our system within 30 days.',
  },
  {
    category: 'Account',
    question: 'Can I change my email address?',
    answer: 'Yes, you can update your email address in your profile settings. You\'ll receive a confirmation email at the new address to verify the change.',
  },
]

const faqCategories = computed(() => {
  const categories = new Set(faqs.map(f => f.category))
  return ['All', ...Array.from(categories).sort()]
})

const filteredFaqs = computed(() => {
  let result = faqs

  // Filter by category
  if (selectedCategory.value !== 'All') {
    result = result.filter(f => f.category === selectedCategory.value)
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(f =>
      f.question.toLowerCase().includes(query) ||
      f.answer.toLowerCase().includes(query)
    )
  }

  return result
})

const toggleFaq = (index: number) => {
  openFaqIndex.value = openFaqIndex.value === index ? null : index
}

// SEO
useHead({
  title: 'FAQ - Comparo',
  meta: [
    {
      name: 'description',
      content: 'Frequently asked questions about Comparo. Find answers to common questions about product comparisons, reviews, and features.',
    },
  ],
})
</script>
