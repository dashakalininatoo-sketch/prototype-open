/* Maps the existing Lesnaya Kollekciya snapshot to the catalog's row model. */
const LESNAYA = (() => {
  const database = window.KAZHK_FLATS_DATABASE;
  if (!database?.flats?.length) throw new Error('Lesnaya Kollekciya dataset is unavailable');
  const verifiedPlanDetails = new Map([
    ['visual-fallback-008', {livingArea: 14.8}]
  ]);
  const flats = database.flats.map(flat => ({
    id: String(flat.id), rooms: flat.rooms, area: flat.areaM2, price: flat.priceRub,
    oldPrice: flat.oldPriceRub, building: flat.building, floor: flat.floor,
    floorsTotal: flat.floorsTotal, date: flat.delivery || database.complex.delivery,
    image: flat.planImage || flat.previewImageUrl, hasPlan: Boolean(flat.planImage),
    finish: flat.finish, livingArea: flat.livingAreaM2, pricePerM2: flat.pricePerM2,
    layoutKey: flat.layoutKey ? String(flat.layoutKey) : `offer-${flat.id}`
  }));
  const offerById = new Map(flats.map(flat => [flat.id, flat]));
  const plans = window.KAZHK_LAYOUT_GROUPS.map(group => {
    const offerRows = group.offerIds.map(id => offerById.get(String(id)));
    if (offerRows.some(offer => !offer)) throw new Error(`Layout group ${group.groupId} references an unknown offer`);
    const cheapest = [...offerRows].sort((a, b) => a.price - b.price)[0];
    const verified = verifiedPlanDetails.get(group.groupId);
    return {...cheapest, id: group.groupId, image: group.planImage, hasPlan: true,
      offers: group.count, offerRows, ...(verified || {})};
  });
  return {complex: database.complex, flats, plans};
})();
