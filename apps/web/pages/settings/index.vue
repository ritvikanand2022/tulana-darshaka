<template>
  <div class="container-custom py-8">
    <div class="max-w-4xl mx-auto">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-text-primary">Settings</h1>
        <p class="text-text-secondary mt-1">Manage your account settings and preferences</p>
      </div>

      <!-- Account Settings -->
      <div class="bg-primary border border-border rounded-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-text-primary mb-4">Account</h2>
        <div class="space-y-4">
          <div class="flex justify-between items-center py-3 border-b border-border">
            <div>
              <h3 class="font-medium text-text-primary">Email Address</h3>
              <p class="text-sm text-text-secondary">{{ authStore.user?.email }}</p>
              <p
                v-if="!authStore.user?.emailVerified"
                class="text-sm text-orange-600 dark:text-orange-400 mt-1"
              >
                Email not verified
              </p>
            </div>
            <button
              v-if="!authStore.user?.emailVerified"
              class="btn btn-secondary btn-sm"
              disabled
            >
              Verify Email (Coming Soon)
            </button>
          </div>

          <div class="flex justify-between items-center py-3 border-b border-border">
            <div>
              <h3 class="font-medium text-text-primary">Password</h3>
              <p class="text-sm text-text-secondary">••••••••</p>
            </div>
            <button class="btn btn-secondary btn-sm" disabled>
              Change Password (Coming Soon)
            </button>
          </div>

          <div class="flex justify-between items-center py-3">
            <div>
              <h3 class="font-medium text-text-primary">Two-Factor Authentication</h3>
              <p class="text-sm text-text-secondary">Add an extra layer of security</p>
            </div>
            <button class="btn btn-secondary btn-sm" disabled>
              Enable 2FA (Coming Soon)
            </button>
          </div>
        </div>
      </div>

      <!-- Privacy Settings -->
      <div class="bg-primary border border-border rounded-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-text-primary mb-4">Privacy</h2>
        <div class="space-y-4">
          <div class="flex justify-between items-center py-3 border-b border-border">
            <div>
              <h3 class="font-medium text-text-primary">Profile Visibility</h3>
              <p class="text-sm text-text-secondary">Control who can see your profile</p>
            </div>
            <select
              v-model="settings.profileVisibility"
              class="px-3 py-2 bg-primary-secondary border border-border rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              disabled
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div class="flex justify-between items-center py-3">
            <div>
              <h3 class="font-medium text-text-primary">Show Activity</h3>
              <p class="text-sm text-text-secondary">
                Let others see your reviews and comparisons
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                v-model="settings.showActivity"
                class="sr-only peer"
                disabled
              />
              <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
              ></div>
            </label>
          </div>
        </div>
      </div>

      <!-- Notification Settings -->
      <div class="bg-primary border border-border rounded-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-text-primary mb-4">Notifications</h2>
        <div class="space-y-4">
          <div class="flex justify-between items-center py-3 border-b border-border">
            <div>
              <h3 class="font-medium text-text-primary">Email Notifications</h3>
              <p class="text-sm text-text-secondary">
                Receive updates about your reviews and comparisons
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                v-model="settings.emailNotifications"
                class="sr-only peer"
                disabled
              />
              <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
              ></div>
            </label>
          </div>

          <div class="flex justify-between items-center py-3 border-b border-border">
            <div>
              <h3 class="font-medium text-text-primary">Review Replies</h3>
              <p class="text-sm text-text-secondary">Get notified when someone replies to your review</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                v-model="settings.reviewReplies"
                class="sr-only peer"
                disabled
              />
              <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
              ></div>
            </label>
          </div>

          <div class="flex justify-between items-center py-3">
            <div>
              <h3 class="font-medium text-text-primary">Marketing Emails</h3>
              <p class="text-sm text-text-secondary">
                Receive news, tips, and special offers
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                v-model="settings.marketingEmails"
                class="sr-only peer"
                disabled
              />
              <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
              ></div>
            </label>
          </div>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <h2 class="text-xl font-semibold text-red-900 dark:text-red-200 mb-4">Danger Zone</h2>
        <div class="space-y-4">
          <div class="flex justify-between items-center py-3">
            <div>
              <h3 class="font-medium text-red-900 dark:text-red-200">Delete Account</h3>
              <p class="text-sm text-red-700 dark:text-red-300">
                Permanently delete your account and all associated data
              </p>
            </div>
            <button class="btn bg-red-600 hover:bg-red-700 text-white" disabled>
              Delete Account (Coming Soon)
            </button>
          </div>
        </div>
      </div>

      <!-- Note about disabled features -->
      <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p class="text-sm text-blue-900 dark:text-blue-200">
          <strong>Note:</strong> Advanced settings features are coming soon. Current functionality
          focuses on authentication and profile management.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const authStore = useAuthStore()

const settings = ref({
  profileVisibility: 'public',
  showActivity: true,
  emailNotifications: true,
  reviewReplies: true,
  marketingEmails: false,
})
</script>
