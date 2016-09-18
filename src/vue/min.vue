<template>
    <div class="min">
        <div class="status">
            <div class="left">To-do List</div>
            <div class="right">
                <i v-text="months[current.month]"></i>
                <i v-text="current.year"></i>
                <i class="fa fa-caret-left" @click="prev"></i>
                <i class="fa fa-caret-right" @click="next"></i>
                <i class="fa fa-refresh" @click="refresh"></i>
            </div>
        </div>
        <ul class="calendar">
            <li v-for="day in date.days" :class="{'today': day.flag}">
                <i class="day" v-text="day.day"></i>
                <i class="week" v-text="weeks[day.week]"></i>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                weeks: [
                    'Sunday', 'Monday', 'Tuesday',
                    'Wednesday', 'Thursday',
                    'Friday', 'Saturday'
                ],
                months: [
                    'Jan.', 'Feb.', 'Mar.', 'Apr.',
                    'May.', 'Jun.', 'Jul.', 'Aug.',
                    'Sep.', 'Oct.', 'Nov.', 'Dec.'
                ],
                current: {
                    year: null,
                    month: null,
                    day: null,
                    week: null
                },
                today: {
                    year: null,
                    month: null,
                    day: null,
                    week: null
                },
                date: {
                    days: []
                }
            }
        },
        methods: {
            init() {
                const today = new Date()
                this.today.year =
                    this.current.year = today.getFullYear()
                this.today.month =
                    this.current.month = today.getMonth()
                this.today.day =
                    this.current.day = today.getDate()
                this.today.week =
                    this.current.week = today.getDay()
            },
            isToday(date) {
                return this.today.year == date.getFullYear() &&
                    this.today.month == date.getMonth() &&
                    this.today.day == date.getDate()
            },
            render() {

                const date = new Date(this.current.year,
                    this.current.month, 1)
                let index = date.getDay() - 1
                let i = 0

                this.clear()

                // 循环填充
                while (true) {
                    if (date.getMonth() !== this.current.month) break
                    index = date.getDay() - 1
                    index < 0 ? index = 6 : null
                    this.date.days.push({
                        day: date.getDate(),
                        flag: this.isToday(date),
                        week: date.getDay()
                    })
                    date.setDate(date.getDate() + 1)
                }
            },
            clear() {
                this.date.days = []
            },
            prev() {
                if (this.current.month == 0) {
                    this.current.month = 11
                    this.current.year--
                } else this.current.month--
                this.render()
            },
            next() {
                if (this.current.month == 11) {
                    this.current.month = 0
                    this.current.year++
                } else this.current.month++
                this.render()
            },
            refresh() {
                this.current.year = this.today.year
                this.current.month = this.today.month
                this.current.day = this.today.day
                this.render()
            }
        },
        ready() {
            this.init()
            this.render()
        }
    }
</script>