CanvasLayer 类提供了在地图上进行 Web 前端 canvas 绘制的功能。具体的 canvas 绘制方法和逻辑可以参考 canvas 的相关资料。
使用 CanvasLayer 的简单示例如下：

```jsx
class Example extends React.Component {
  render() {
    return (
      <>
        <BDMap center={new BMap.Point(116.3964, 39.9093)} style={{ height: 450 }} zoom={10}>
          <CanvasLayer
            update={(canvas, map) => {
              const ctx = canvas.getContext('2d')

              if (!ctx) {
                return
              }

              ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

              const temp = {}
              ctx.fillStyle = 'rgba(50, 50, 255, 0.7)'
              ctx.beginPath()
              const data = [
                new BMap.Point(116.297047, 39.979542),
                new BMap.Point(116.321768, 39.88748),
                new BMap.Point(116.494243, 39.956539),
              ]

              for (let i = 0, len = data.length; i < len; i++) {
                // 绘制时需要对经纬度进行转换
                const pixel = map.pointToPixel(data[i])

                ctx.fillRect(pixel.x, pixel.y, 30, 30)
              }
            }}
          />
        </BDMap>
      </>
    )
  }
}

;<BDMapWrapper>
  <Example />
</BDMapWrapper>
```
