import dayjs from 'dayjs'
export function formatDateYYYYMMDDHHMMSS(date: any){
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}