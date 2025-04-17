import { computed, ref, type Ref } from 'vue'
import lunisolar from '../lib/lunisolar'
import { Builder } from 'shiren-columns'
import { plate } from 'shiren-calendar'
import { filter, first, get, map, zip } from 'lodash'
import { CalendarMode } from '../types'
import { appState, orderState } from './shared'
import pluginchar8exZh from '../lib/lunisolar/plugins/char8ex/locale/zh-cn'
import plugintheGodsZh from '../lib/lunisolar/plugins/theGods/locale/zh-cn'
import pluginTakeSoundZh from '../lib/lunisolar/plugins/takeSound/locale/zh-cn'
import theGods from '../lib/lunisolar/plugins/theGods'
import char8ex from '../lib/lunisolar/plugins/char8ex'
import takeSound from '../lib/lunisolar/plugins/takeSound'

import zhCn from '../lib/lunisolar/locale/zh-cn'
import Taro from '@tarojs/taro'

lunisolar
  .extend(char8ex)
  .extend(theGods)
  .extend(takeSound)
  .locale(zhCn)
  .locale(pluginchar8exZh)
  .locale(plugintheGodsZh)
  .locale(pluginTakeSoundZh)

const BG_ELEMENT_COLORS = {
  金: 'bg-matel/80',
  木: 'bg-wood/80',
  水: 'bg-water/80',
  火: 'bg-fire/80',
  土: 'bg-earth/80'
}

const FG_ELEMENT_COLORS = {
  金: 'text-matel',
  木: 'text-wood',
  水: 'text-water',
  火: 'text-fire',
  土: 'text-earth'
}

const TENSTARS = {
  印: '正印',
  卩: '偏印',
  劫: '劫财',
  比: '比肩',
  伤: '伤官',
  食: '食神',
  财: '正财',
  才: '偏财',
  官: '正官',
  杀: '七杀'
}

export const useAppData = () => {
  const {
    isPreviewing,
    selectedYear,
    selectedMonth,
    selectedDay,
    selectedHour,
    calendarMode,
    selectedGender,
    currentLuckDay,
    currentLuckMonth,
    lsrObject,
    birthday,
    currentLuckYear,
    currentFortune
  } = appState

  const updateBirthday = (date: Date, mode: CalendarMode) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    calendarMode.value = mode
    birthday.value = date
    if (calendarMode.value === 'lunar') {
      lsrObject.value = lunisolar.fromLunar({
        year,
        month,
        day,
        hour
      })
    } else {
      lsrObject.value = lunisolar(date)
    }
  }

  const updateGender = (gender: number | null) => {
    selectedGender.value = gender
  }

  const updateCalendarMode = (value: string) => {
    calendarMode.value = value as 'solar' | 'lunar'
  }

  const eightChar = computed(() => {
    if (!lsrObject.value || selectedGender.value === null) {
      return null
    }
    const lsr = lsrObject.value
    const c8 = lsr.char8ex(selectedGender.value as 0 | 1)
    const hiddenStems = [
      c8.year.branch.hiddenStems,
      c8.month.branch.hiddenStems,
      c8.day.branch.hiddenStems,
      c8.hour.branch.hiddenStems
    ].map((branchStems) => branchStems.map((branchStem) => branchStem.name))

    const branchStems = [
      c8.year.branchTenGod,
      c8.month.branchTenGod,
      c8.day.branchTenGod,
      c8.hour.branchTenGod
    ].map((branchStems) => branchStems.map((branchStem) => branchStem.name))

    return {
      tenStar: [
        c8.year.stemTenGod.name,
        c8.month.stemTenGod.name,
        c8.day.stemTenGod.name,
        // selectedGender.value === Gender.MAN ? '元男' : '元女',
        c8.hour.stemTenGod.name
      ],
      heavenStem: [c8.year.stem, c8.month.stem, c8.day.stem, c8.hour.stem].map((stem) => ({
        name: stem.name,
        color: BG_ELEMENT_COLORS[stem.e5.name]
      })),
      earthBranch: [c8.year.branch, c8.month.branch, c8.day.branch, c8.hour.branch].map(
        (branch) => ({
          name: branch.name,
          color: BG_ELEMENT_COLORS[branch.e5.name]
        })
      ),
      // /**c8 不支持  中取十神,  tyme4ts 库来实现 */
      hideHeavenStems: zip(hiddenStems, branchStems).map((pair) =>
        zip(pair[0], pair[1]).map(([name, tenStar]) => ({ name, tenStar }))
      ),
      sound: [c8.year.takeSound, c8.month.takeSound, c8.day.takeSound, c8.hour.takeSound],
      missing: [c8.year.missing, c8.month.missing, c8.day.missing, c8.hour.missing].map(
        (missings) => missings.join('-')
      ),
      gods: [c8.year.gods, c8.month.gods, c8.day.gods, c8.hour.gods].map((gods) =>
        gods.map((god) => {
          return {
            name: get(pluginchar8exZh.char8ex.gods as object, god.name),
            luckLevel: god.luckLevel
          }
        })
      )
    }
  })
  const stemNames = lunisolar.Stem.getNames()
  const stemNamesFortune = ['', ...stemNames]
  const fortunes = computed(() => {
    if (!lsrObject.value) {
      return []
    }

    const lsr = lsrObject.value
    const info = plate(true, lsr.year, lsr.month, lsr.day, lsr.hour)

    const {
      basic,
      lucky: { datetime }
    } = info

    const dg = basic.g[2]
    // 把四柱天干｜地支索引转换为对应的天干颜色
    info.basic.g = Builder.g(dg, info.basic.g)
    info.basic.z = Builder.z(dg, info.basic.z)
    // 把大运的天干｜地支索引转换为对应的天干颜色
    info.lucky.g = Builder.g(dg, info.lucky.g)
    info.lucky.z = Builder.z(dg, info.lucky.z)

    return map(
      filter(datetime, (_, i: number) => i < 10),
      (luckyTime: any, index: number) => {
        const lunar = lunisolar(luckyTime)

        return {
          age: lunar.year - lsr.year,
          year: lunar.year,
          stemName: info.lucky.g[index].name,
          branchName: info.lucky.z[index].name,
          branchColor: FG_ELEMENT_COLORS[(first(info.lucky.z[index].element) as any).name],
          stemColor: FG_ELEMENT_COLORS[(first(info.lucky.g[index].element) as any).name],
          tenStarsOfBranch: map(info.lucky.z[index].spirit, (spirit) => TENSTARS[spirit.name]),
          tenStarsOfStem: map(info.lucky.g[index].spirit, (spirit) => TENSTARS[spirit.name])
        }
      }
    )
  })

  const lucky = computed(() => {
    if (!lsrObject.value) {
      return null
    }

    const lsr = lsrObject.value
    const info = plate(true, lsr.year, lsr.month, lsr.day, lsr.hour)

    const {
      basic,
      lucky: { desc, g, z, datetime },
      shiren: { year }
    } = info

    return {
      desc,
      year,
      datetime: datetime[0],
      stuffOfYear: (year + '')[3]
    }
  })

  const setFortune = (fortune: any) => {
    currentFortune.value = fortune
  }
  const setLuckYear = (year: any) => {
    currentLuckYear.value = year
  }

  const luckYears = computed(() => {
    if (!lsrObject.value || !currentFortune.value) {
      return null
    }

    const lsr = lsrObject.value
    const info = plate(true, lsr.year, lsr.month, lsr.day, lsr.hour)
    const { basic } = info
    const dg = basic.g[2]
    return Builder.year(currentFortune.value).map((item: any, index: number) => {
      const luckYear = Builder.gz(dg, item)
      const { g: stem, z: branch } = luckYear

      return {
        year: currentFortune.value + index,
        age: currentFortune.value + index - lsr.year,
        branchName: branch.name,
        stemName: stem.name,
        branchColor: get(FG_ELEMENT_COLORS, (first(branch.element) as any).name),
        stemColor: get(FG_ELEMENT_COLORS, (first(stem.element) as any).name),
        tenStarsOfBranch: map(branch.spirit, (spirit) => TENSTARS[spirit.name]),
        tenStarsOfStem: map(stem.spirit, (spirit) => TENSTARS[spirit.name])
      }
    })
  })

  const luckMonths = computed(() => {
    if (!lsrObject.value || !currentLuckYear.value) {
      return null
    }

    const lsr = lsrObject.value
    const info = plate(true, lsr.year, lsr.month, lsr.day, lsr.hour)
    const { basic } = info
    const dg = basic.g[2]
    return Builder.month(currentLuckYear.value).map((item: any, index: number) => {
      const { g: stem, z: branch } = Builder.gz(dg, item)

      return {
        ...item,
        month: index + 1,
        branchName: branch.name,
        stemName: stem.name,
        branchColor: get(FG_ELEMENT_COLORS, first<any>(branch.element).name),
        stemColor: get(FG_ELEMENT_COLORS, first<any>(stem.element).name),
        tenStarsOfBranch: map(branch.spirit, (spirit) => TENSTARS[spirit.name]),
        tenStarsOfStem: map(stem.spirit, (spirit) => TENSTARS[spirit.name])
      }
    })
  })

  const luckDays = computed(() => {
    if (!lsrObject.value || !currentLuckMonth.value) {
      return null
    }

    const lsr = lsrObject.value
    const info = plate(true, lsr.year, lsr.month, lsr.day, lsr.hour)
    const { basic, lucky } = info
    const dg = basic.g[2]
    const luckMonth = luckMonths.value.find(
      (luckMonth: any) => luckMonth.month === currentLuckMonth.value
    )
    return Builder.day(luckMonth).map((item: any, index: number) => {
      const { g: stem, z: branch } = Builder.gz(dg, item)

      return {
        day: index + 1,
        branchName: branch.name,
        stemName: stem.name,
        branchColor: get(FG_ELEMENT_COLORS, (first(branch.element) as any).name),
        stemColor: get(FG_ELEMENT_COLORS, (first(stem.element) as any).name),
        tenStarsOfBranch: map(branch.spirit, (spirit) => TENSTARS[spirit.name]),
        tenStarsOfStem: map(stem.spirit, (spirit) => TENSTARS[spirit.name])
      }
    })
  })

  return {
    isPreviewing,
    birthday,
    updateBirthday,
    updateGender,
    eightChar,
    luckYears,
    luckMonths,
    setLuckYear,
    luckDays,
    currentFortune,
    currentLuckYear,
    currentLuckDay,
    lsrObject,
    lucky,
    fortunes,
    selectedYear,
    selectedMonth,
    selectedDay,
    selectedHour,
    calendarMode,
    selectedGender,
    setFortune,
    updateCalendarMode,
    currentLuckMonth
  }
}
