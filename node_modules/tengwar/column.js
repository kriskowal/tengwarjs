
module.exports = makeColumn;
function makeColumn(font, tengwa, tengwaNote) {
    return new Column(font, tengwa, tengwaNote);
};

var Column = function (font, tengwa, tengwaNote) {
    this.font = font;
    this.above = void 0;
    this.tildeAbove = void 0;
    this.tengwa = tengwa;
    this.tildeBelow = void 0;
    this.below = void 0;
    this.following = void 0;
    this.error = void 0;

    this.aboveNote = void 0;
    this.tildeAboveNote = void 0;
    this.tengwaNote = tengwaNote;
    this.tildeBelowNote = void 0;
    this.belowNote = void 0;
    this.followingNote = void 0;

    this.hasVariant = false;
};

Column.prototype.canAddAbove = function (tehta, reversed) {
    return (
        !this.above && !!this.font.tehtaForTengwa(this.tengwa, tehta)
    ) || ( // flip it
        !reversed && !this.below && this.reversed().canAddAbove(tehta, true)
    );
};

Column.prototype.addAbove = function (above, aboveNote) {
    if (!this.font.tehtaForTengwa(this.tengwa, above)) {
        this.reverse();
    }
    this.above = above;
    this.aboveNote = aboveNote;
    return this;
};

Column.prototype.canAddBelow = function (tehta, reversed) {
    return (
        !this.below && !!this.font.tehtaForTengwa(this.tengwa, tehta)
    ) || ( // flip it
        !reversed && !this.above && this.reversed().canAddBelow(tehta, true)
    );
};

Column.prototype.addBelow = function (below, belowNote) {
    if (!this.font.tehtaForTengwa(this.tengwa, below)) {
        this.reverse();
    }
    this.below = below;
    this.belowNote = belowNote;
    return this;
};

Column.prototype.addTildeAbove = function (tildeAboveNote) {
    this.tildeAbove = true;
    this.tildeAboveNote = tildeAboveNote;
    return this;
};

Column.prototype.addTildeBelow = function (tildeBelowNote) {
    this.tildeBelow = true;
    this.tildeBelowNote = tildeBelowNote;
    return this;
};

Column.prototype.canAddFollowing = function (following) {
    return !this.following && !!this.font.tehtaForTengwa(this.tengwa, following);
};

Column.prototype.addFollowing = function (following, followingNote) {
    this.following = following;
    this.followingNote = followingNote;
    return this;
};

Column.prototype.reversed = function () {
    return this.clone().reverse();
};

Column.prototype.clone = function () {
    var column = new Column(this.font, this.tengwa);
    if (this.above) column.addAbove(this.above, this.aboveNote);
    if (this.below) column.addBelow(this.below, this.belowNote);
    if (this.following) column.addFollowing(this.following, this.followingNote);
    if (this.tildeBelow) column.addTildeBelow(this.tildeBelowNote);
    if (this.tildeAbove) column.addTildeAbove(this.tildeAboveNote);
    return column;
};

var reversed = {
    "silme": "silme-nuquerna",
    "esse": "esse-nuquerna",
    "silme-nuquerna": "silme",
    "esse-nuquerna": "esse"
};

Column.prototype.reverse = function () {
    this.tengwa = reversed[this.tengwa] || this.tengwa;
    return this;
};

Column.prototype.addError = function (error) {
    this.errors = this.errors || [];
    this.errors.push(error);
    return this;
};

Column.prototype.varies = function () {
    this.hasVariant = true;
    return this;
};

