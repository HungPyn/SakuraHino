<template>
  <div class="bg-white shadow rounded p-4">
    <table class="w-full table-auto border">
      <thead>
        <tr class="bg-gray-100 text-left">
          <th class="p-2">Từ Vựng</th>
          <th class="p-2">Nghĩa</th>
          <th class="p-2">Cấp Độ</th>
          <th class="p-2">Danh Mục</th>
          <th class="p-2">Độ Khó</th>
          <th class="p-2">Cập Nhật</th>
          <th class="p-2">Thao Tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="word in words" :key="word.id" class="border-t">
          <td class="p-2">
            <div class="text-lg">{{ word.kanji }}</div>
            <div class="text-sm text-gray-600 italic">{{ word.kana }}</div>
          </td>
          <td class="p-2">{{ word.meaning }}</td>
          <td class="p-2">
            <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">{{ word.level }}</span>
          </td>
          <td class="p-2">{{ word.category }}</td>
          <td class="p-2">
            <span :class="word.difficulty === 'Dễ' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'" class="px-2 py-1 rounded text-sm">
              {{ word.difficulty }}
            </span>
          </td>
          <td class="p-2">{{ word.updated }}</td>
          <td class="p-2 flex gap-2">
            <button class="text-blue-600 hover:underline">✏️</button>
            <button class="text-red-600 hover:underline">🗑️</button>
            <button class="text-green-600 hover:underline">🔊</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    words: Array
  }
}
</script>
