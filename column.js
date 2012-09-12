
module.exports = makeColumn;
function makeColumn(font, tengwa) {
    return new Column(font, tengwa);
};

var Column = function (font, tengwa) {
    this.font = font;
    this.above = void 0;
    this.tildeAbove = void 0;
    this.tengwa = tengwa;
    this.tildeBelow = void 0;
    this.below = void 0;
    this.following = void 0;
    this.error = void 0;
};

Column.prototype.canAddAbove = function (tehta, reversed) {
    return (
        !this.above && !!this.font.tehtaForTengwa(this.tengwa, tehta)
    ) || ( // flip it
        !reversed && !this.below && this.reversed().canAddAbove(tehta, true)
    );
};

Column.prototype.addAbove = function (above) {
    if (!this.font.tehtaForTengwa(this.tengwa, above)) {
        this.reverse();
    }
    this.above = above;
    return this;
};

Column.prototype.canAddBelow = function (tehta, reversed) {
    return (
        !this.below && !!this.font.tehtaForTengwa(this.tengwa, tehta)
    ) || ( // flip it
        !reversed && !this.above && this.reversed().canAddBelow(tehta, true)
    );
};

Column.prototype.addBelow = function (below) {
    if (!this.font.tehtaForTengwa(this.tengwa, below)) {
        this.reverse();
    }
    this.below = below;
    return this;
};

Column.prototype.addTildeAbove = function () {
    this.tildeAbove = true;
    return this;
};

Column.prototype.addTildeBelow = function () {
    this.tildeBelow = true;
    return this;
};

Column.prototype.canAddFollowing = function (following) {
    return !this.following && !!this.font.tehtaForTengwa(this.tengwa, following);
};

Column.prototype.addFollowing = function (following) {
    this.following = following;
    return this;
};

Column.prototype.reversed = function () {
    return this.clone().reverse();
};

Column.prototype.clone = function () {
    var column = new Column(this.font, this.tengwa);
    if (this.above) column.addAbove(this.above);
    if (this.below) column.addBelow(this.below);
    if (this.following) column.addFollowing(this.following);
    if (this.tildeBelow) column.addTildeBelow();
    if (this.tildeAbove) column.addTildeAbove();
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

