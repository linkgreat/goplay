import {atom, useRecoilStateLoadable} from "recoil";
import {persistAtom} from "./common";

export const locationState = atom({
    key: 'global.filter.therapists.location',
    default: [118, 32],
    effects_UNSTABLE: [persistAtom ],
});
export function useCurrentLonLatRecoil() {
    const [posLoadable, setPos] = useRecoilStateLoadable(locationState);
    const locate = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    setPos([longitude, latitude]);
                    console.log('当前位置的纬度：', latitude);
                    console.log('当前位置的经度：', longitude);
                },
                function (error) {
                    console.log('获取位置信息失败：', error.message);
                }
            );
        } else {
            console.log('浏览器不支持Geolocation API');
        }
    }
    const result = {error: false, loading: false, lon: 0, lat: 0, pos: [0, 0], setPos, locate};
    switch (posLoadable.state) {
        case "loading":
            result.loading = true;
            break;
        case "hasError":
            result.error = true;
            break;
        case "hasValue":
            result.pos = posLoadable.contents;
            result.lon = result.pos?.[0] ?? 0;
            result.lat = result.pos?.[1] ?? 0;
            break;
    }
    return result;
}