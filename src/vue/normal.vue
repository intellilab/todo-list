<template>
    <div class="normal">
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
        <div class="calendar">
            <ul class="week">
                <li v-for="x in weeks" v-text="x"></li>
            </ul>
            <div class="date">
                <ul class="col"
                    v-for="week in date.weeks"
                >
                    <li v-for="day in week"><i
                        :class="{'today': day.flag}"
                        v-text="day.day"
                    ></i></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                weeks: [
                    'Monday', 'Tuesday',
                    'Wednesday', 'Thursday',
                    'Friday', 'Saturday', 'Sunday'
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
                    el: document.querySelectorAll('.date .col'),
                    weeks: [
                        [], [], [],
                        [], [], [],
                        []
                    ],
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
                index < 0 ? index = 6 : null
                this.date.weeks[index].push({
                    day: date.getDate(),
                    flag: false
                })
                // 前向填充
                while (i < index) {
                    this.date.weeks[i].push({day: null, flag: false})
                    i++
                }
                // 循环填充
                while (true) {
                    date.setDate(date.getDate() + 1)
                    if (date.getMonth() !== this.current.month) break
                    index = date.getDay() - 1
                    index < 0 ? index = 6 : null
                    this.date.weeks[index].push({
                        day: date.getDate(),
                        flag: this.isToday(date)
                    })
                }
                // 后向填充
                while (index < 6) this.date.weeks[++index].push({day: null, flag: false})
            },
            clear() {
                for (let i = 0; i < this.date.weeks.length; i++)
                    this.date.weeks.$set(i, [])
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