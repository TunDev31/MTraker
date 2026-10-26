 export const buildPie = (byTag, type) =>
    (byTag || [])
      .filter((d) => d.type === type)
      .map((d) => ({ tag: d.tag, value: Number(d.total) || 0 }))
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value);

  