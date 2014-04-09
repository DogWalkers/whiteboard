// Passive data node for hash tables.
#include<iostream>
#include<string>
#include<algorithm>
#include<vector>
#include<fstream>

using namespace std;

struct Node {
    string word;
    Node* next;
};


int scrabbleValue(char ch)
{
    ch = tolower(ch);
    switch(ch)
    {
        case 'a':
        case 'e':
        case 'i':
        case 'o':
        case 'n':
        case 'r':
        case 't':
        case 'l':
        case 's':
        case 'u':
            return 1;
        case 'd':
        case 'g':
            return 2;
        case 'b':
        case 'c':
        case 'm':
        case 'p':
            return 3;
        case 'f':
        case 'h':
        case 'v':
        case 'w':
        case 'y':
            return 4;
        case 'k':
            return 5;
        case 'j':
        case 'x':
            return 8;
        case 'q':
        case 'z':
            return 10;
        default:
            return 0;
    }
}

int scrabbleValue(string str)
{
    int sum = 0;
    for(int i = 0; i < str.size(); i++)
    {
        sum = sum + scrabbleValue(str[i]);
    }
    return sum;
}


int asciiValue(char ch)
{
    return (int)ch;
}

int power(int num, int exp)
{
    int pow = 1;
    for(int i = 1; i <= exp; i++)
    {
        pow = pow*num;
    }
    return pow;
}


class HashTable {
    public :
    HashTable ();
    HashTable (int K);
    virtual ~HashTable();
    void insert (string word);
    void remove (string word);      // You implement this!
    bool lookup (string word) const;
    void print () const;
    void report () const;
    static const int DefaultSize;
    
    protected :
    int getTableSize() const;
    private :
    vector<Node*> table;
    // The "hash" function will be defined by each child class,
    // each one using a different strategy.  But it needs to be
    // abstract (aka "pure virtual") in the abstract parent class.
    virtual int hash (string key) const = 0;
};

class SmartHashTable:public HashTable
{
public:
    SmartHashTable():HashTable()
    {
        
    }
    SmartHashTable(int simpleK):HashTable(simpleK)
    {
        
    }
    ~SmartHashTable()
    {
        
    }
    
private:
    
    int hash (string key) const
    {
        int num = 0;
        for(int i = 0; i< key.size(); i++)
        {
            //cout<<num<<endl;
            num = num + asciiValue(key[i])*power(3,i);
        }
        //cout<<"***"<<num<<"***";
        //return num;
        return num % getTableSize();
    }
};

const int HashTable::DefaultSize = 1000;
HashTable::HashTable() : table(DefaultSize) {}
HashTable::HashTable(int K) : table(K) {}

HashTable::~HashTable(){
    for (int i=0; i<getTableSize(); i++) {
        Node* p = table[i];
        while (p!=NULL) {
            Node* temp = p;
            p = p->next;
            delete temp;
        }
    }
}

int HashTable::getTableSize() const
{
    return (int) table.size();
}

void HashTable::insert(string key) {
    const int slot = hash(key);
    Node* newNode = new Node;
    newNode->word = key;
    newNode->next = table[slot];
    table[slot] = newNode;
}

bool HashTable::lookup (string key) const {
    const int slot = hash(key);
    Node* curNode = table[slot];
    while (curNode != NULL) {
        if (curNode->word == key) {
            return true;
        }
        curNode = curNode -> next;
    }
    return false;
}

void HashTable::remove(string key)
{
    if(lookup(key) == true)
    {
        const int slot = hash(key);
        Node* curNode = table[slot];
        if(curNode != NULL && curNode->word == key)
        {
            table[slot] = curNode->next;
        }
        else
        {
            while (curNode != NULL)
            {
                if (curNode->next->word == key)
                {
                    Node* tmp = curNode->next;
                    curNode->next = curNode->next->next;
                    delete tmp;
                }
                curNode = curNode -> next;
            }
        }
    }
    else
    {
        return;
    }
}
void HashTable::print() const {
    for (int i=0; i<getTableSize(); i++) {
        if (table[i] != NULL) {
            Node* p = table[i];
            while (p != NULL) {
                cout << i << "    " << p->word << endl;
                p = p->next;
            }
        }
    }
}

void HashTable::report () const {
    // K is number of buckets
    const int K = getTableSize();
    // How many overflow elements in each bucket?
    vector<int> stats (K);
    int totalNumEntries = 0;
    int numNonZeros = 0;
    int maxOverflowSize = 0;
    for (int i=0; i<K ; i++) {
        if (table[i] != NULL) {
            numNonZeros++;
            int numEntriesInThisBucket = 0;
            Node* p = table[i];
            while (p != NULL) {
                p = p->next;
                numEntriesInThisBucket++;
            }
            totalNumEntries += numEntriesInThisBucket;
            if (numEntriesInThisBucket > maxOverflowSize) {
                maxOverflowSize = numEntriesInThisBucket;
            }
            stats[i]=numEntriesInThisBucket;
        }
    }
    sort(stats.begin(), stats.end());
    const int numEmptyBuckets = K - numNonZeros;
    const int firstNonZeroBucketIndex = numEmptyBuckets;
    cout << "Number of entries in table: " << totalNumEntries << endl;
    cout << "Total # buckets: " << K << " of which " << numEmptyBuckets
    << " (" << 100 * numEmptyBuckets / K << "%)" << " were empty." <<
    endl;
        const int median = stats[firstNonZeroBucketIndex + numNonZeros/2];
    const int average = totalNumEntries / numNonZeros;
    cout << "Overflow list length:  Max = " << maxOverflowSize
    << "  Median = " << median << "  Average = " << average <<  endl;
}


vector<string> addChar (const vector<string>& v, char c) {
    vector<string> ans;
    for (int i=0; i<(int)v.size() ; i++) {
        ans.push_back(c + v.at(i));
    }
    return ans;
}


vector<string> powerset (string s) {
    vector<string> ans;
    if (s.size() == 0) {
        ans.push_back("");
    } else {
        char c = s.at(0);
        string rest = s.substr(1);
        vector<string> psetRest = powerset (rest);
        ans = addChar (psetRest, c);
        ans.insert(ans.end(), psetRest.begin(), psetRest.end());
    }
    return ans;
}



int main(int argc, const char * argv[])
{
    string input;
    vector<string> strList;
    if(argv[1] == NULL)
    {
        cerr<<"Error, no word list file name provided."<<endl;
        return 0;
    }
    
    ifstream wordlistFileName(argv[1]);
    
    if(!wordlistFileName.is_open())
    {
        cerr<<"Error, couldn't open word list file."<<endl;
        return 0;
    }
    
    SmartHashTable smart;

    while(wordlistFileName>>input)
    {
        smart.insert(input);
    }
    string strWord;
    while(cin>>strWord)
    {
        string word;
        bool isPresent = false;
        int maxScrabble = 0;
        strList = powerset(strWord);
        for(int i = 0; i < strList.size(); i++)
        {
            string s = strList.at(i);
            sort(s.begin(), s.end());
        
            do
            {
                if(smart.lookup(s))
                {
                    isPresent = true;
                    if(maxScrabble < scrabbleValue(s))
                    {
                        maxScrabble = scrabbleValue(s);
                        word = s;
                    }
                }
            } while (next_permutation(s.begin(), s.end()));
        }
        if(isPresent)
        {
            cout<<strWord<<": "<<word<<" has score of "<<maxScrabble<<endl;
        }
        else
        {
            cout<<strWord<<": "<<"no matches"<<endl;
        }
    }
    
    
    
}
